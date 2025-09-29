import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { getItemTotal } from './item.total.service'
import { countValoresForItem } from './item.valor-count.service'
import { type Item } from '@sgaf/shared'
import { omit } from '../utils/omit'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    return await this.prisma.$transaction(async (tx) => {
      const now = new Date(new Date(Date.now()).setUTCHours(0, 0, 0, 0))

      // Validate banda constraint
      if (createItemDto.banda_instalada > createItemDto.banda_maxima) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima',
        )
      }

      // Validate quantidade constraint
      if (createItemDto.quantidade > createItemDto.quantidade_maxima) {
        throw new BadRequestException(
          'Quantidade não pode exceder quantidade máxima',
        )
      }

      const item = await tx.item.create({
        data: {
          principalId: createItemDto.principalId,
          descricao: createItemDto.descricao,
          banda_maxima: createItemDto.banda_maxima,
          quantidade_maxima: createItemDto.quantidade_maxima,
        },
      })

      await tx.itemLocal.create({
        data: {
          itemId: item.id,
          localId: createItemDto.localId,
          banda_instalada: createItemDto.banda_instalada,
          data_instalacao: new Date(createItemDto.data_instalacao),
          quantidade: createItemDto.quantidade,
          status: createItemDto.status,
        },
      })

      await tx.valor.create({
        data: {
          valor: createItemDto.valor,
          data_inicio: new Date(createItemDto.data_instalacao),
          data_fim: createItemDto.status ? null : now,
          itemId: item.id,
          afId: createItemDto.principalId,
        },
      })

      const local = await tx.local.findUniqueOrThrow({
        where: { id: createItemDto.localId },
        select: { nome: true },
      })

      return {
        ...item,
        locais: [
          {
            id: createItemDto.localId,
            nome: local.nome,
            banda_instalada: createItemDto.banda_instalada,
            data_instalacao: createItemDto.data_instalacao,
            quantidade: createItemDto.quantidade,
            status: createItemDto.status,
          },
        ],
        quantidade_total: createItemDto.quantidade,
        total: 0,
        valor_count: 1,
      }
    })
  }

  async findOne(id: number, afId: number): Promise<Item | null> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: {
        itemLocais: {
          include: { local: { select: { nome: true } } },
        },
      },
    })

    const total = await getItemTotal(this.prisma, item.id, afId)
    const valor_count = await countValoresForItem(this.prisma, item.id)

    const { itemLocais, ...itemWithoutRelations } = item

    return {
      ...itemWithoutRelations,
      locais: itemLocais.map((il) => ({
        id: il.localId,
        nome: il.local.nome,
        banda_instalada: il.banda_instalada,
        data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
        quantidade: il.quantidade,
        status: il.status,
      })),
      quantidade_total: itemLocais.reduce((sum, il) => sum + il.quantidade, 0),
      total,
      valor_count,
    }
  }

  async findManyByAf(afId: number): Promise<Item[]> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: afId },
      select: { principal: true },
    })

    let items
    if (af.principal) {
      items = await this.prisma.item.findMany({
        where: { principalId: afId },
        include: {
          itemLocais: {
            include: { local: { select: { nome: true } } },
          },
        },
      })
    } else {
      // AF relacionada: items via current Valor (data_fim: null)
      const currentValores = await this.prisma.valor.findMany({
        where: { afId: afId, data_fim: null },
        include: {
          item: {
            include: {
              itemLocais: {
                include: { local: { select: { nome: true } } },
              },
            },
          },
        },
      })
      items = currentValores.map((v) => v.item)
    }

    return Promise.all(
      items.map(async (item) => {
        const total = await getItemTotal(this.prisma, item.id, afId)
        const valor_count = await countValoresForItem(
          this.prisma,
          item.id,
          afId,
        )

        const { itemLocais, ...itemWithoutRelations } = item

        return {
          ...itemWithoutRelations,
          locais: itemLocais.map((il) => ({
            id: il.localId,
            nome: il.local.nome,
            banda_instalada: il.banda_instalada,
            data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
            quantidade: il.quantidade,
            status: il.status,
          })),
          quantidade_total: itemLocais.reduce(
            (sum, il) => sum + il.quantidade,
            0,
          ),
          total,
          valor_count,
        }
      }),
    )
  }

  async attachLocais(
    itemId: number,
    locais: Array<{
      localId: number
      banda_instalada: number
      data_instalacao: string
      quantidade: number
      status: boolean
    }>,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: itemId },
        include: { itemLocais: true },
      })

      // Calculate current total quantidade
      const currentTotal = item.itemLocais.reduce(
        (sum, il) => sum + il.quantidade,
        0,
      )
      const newTotal = locais.reduce((sum, local) => sum + local.quantidade, 0)

      if (currentTotal + newTotal > item.quantidade_maxima) {
        throw new BadRequestException(
          `Quantidade (${currentTotal + newTotal}) excede máximo (${item.quantidade_maxima})`,
        )
      }

      // Validate banda constraints
      for (const local of locais) {
        if (local.banda_instalada > item.banda_maxima) {
          throw new BadRequestException(
            'Banda instalada não pode exceder banda máxima',
          )
        }
      }

      // Create new ItemLocal records
      const promises = locais.map((local) =>
        tx.itemLocal.create({
          data: {
            itemId,
            localId: local.localId,
            banda_instalada: local.banda_instalada,
            data_instalacao: new Date(local.data_instalacao),
            quantidade: local.quantidade,
            status: local.status,
          },
        }),
      )

      await Promise.all(promises)
    })
  }

  async updateItemLocal(
    itemId: number,
    localId: number,
    data: {
      banda_instalada?: number
      data_instalacao?: string
      quantidade?: number
      status?: boolean
    },
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: itemId },
        include: { itemLocais: true },
      })

      // Validate banda constraint if updating
      if (
        data.banda_instalada !== undefined &&
        data.banda_instalada > item.banda_maxima
      ) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima',
        )
      }

      // Validate quantidade constraint if updating
      if (data.quantidade !== undefined) {
        const currentItemLocal = item.itemLocais.find(
          (il) => il.localId === localId,
        )
        if (!currentItemLocal) {
          throw new BadRequestException('ItemLocal não encontrado')
        }

        const otherQuantidades = item.itemLocais
          .filter((il) => il.localId !== localId)
          .reduce((sum, il) => sum + il.quantidade, 0)

        if (otherQuantidades + data.quantidade > item.quantidade_maxima) {
          throw new BadRequestException(
            `Total quantidade excederia máximo (${item.quantidade_maxima})`,
          )
        }
      }

      await tx.itemLocal.updateMany({
        where: { itemId, localId },
        data: {
          ...data,
          data_instalacao: data.data_instalacao
            ? new Date(data.data_instalacao)
            : undefined,
        },
      })
    })
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id },
      data: {
        descricao: updateItemDto.descricao,
        banda_maxima: updateItemDto.banda_maxima,
        quantidade_maxima: updateItemDto.quantidade_maxima,
      },
      include: {
        itemLocais: {
          include: { local: { select: { nome: true } } },
        },
      },
    })

    const total = await getItemTotal(this.prisma, item.id, item.principalId)
    const valor_count = await countValoresForItem(
      this.prisma,
      item.id,
      item.principalId,
    )

    const { itemLocais, ...itemWithoutRelations } = item

    return {
      ...itemWithoutRelations,
      locais: itemLocais.map((il) => ({
        id: il.localId,
        nome: il.local.nome,
        banda_instalada: il.banda_instalada,
        data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
        quantidade: il.quantidade,
        status: il.status,
      })),
      quantidade_total: itemLocais.reduce((sum, il) => sum + il.quantidade, 0),
      total,
      valor_count,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    })
  }
}
