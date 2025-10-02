import { Injectable } from '@nestjs/common'
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

  async create(createItemDto: CreateItemDto): Promise<Item> {
    return await this.prisma.$transaction(async (tx) => {
      const principal = await this.prisma.aF.findUniqueOrThrow({
        where: { id: createItemDto.principalId },
      })

      const item = await tx.item.create({
        data: {
          principalId: createItemDto.principalId,
          descricao: createItemDto.descricao,
          banda_maxima: createItemDto.banda_maxima,
          quantidade_maxima: createItemDto.quantidade_maxima,
        },
      })

      await tx.valor.create({
        data: {
          valor: createItemDto.valor,
          data_inicio: new Date(principal.data_inicio),
          data_fim: null,
          itemId: item.id,
          afId: createItemDto.principalId,
        },
      })

      return {
        ...omit(item, ['data_alteracao']),
        data_alteracao: item.data_alteracao
          ? item.data_alteracao.toISOString().slice(0, 10)
          : null,
        locais: [],
        quantidade_total: 0,
        total: 0,
        valor_count: 1,
        instalados_count: 0,
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
      ...omit(itemWithoutRelations, ['data_alteracao']),
      data_alteracao: item.data_alteracao
        ? item.data_alteracao.toISOString().slice(0, 10)
        : null,
      locais: itemLocais.map((il) => ({
        id: il.localId,
        nome: il.local.nome,
        banda_instalada: il.banda_instalada,
        data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: il.data_desinstalacao
          ? il.data_desinstalacao.toISOString().slice(0, 10)
          : null,
        quantidade: il.quantidade,
        status: il.status,
      })),
      quantidade_total: itemLocais.reduce((sum, il) => sum + il.quantidade, 0),
      total,
      valor_count,
      instalados_count: itemLocais.length,
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
          ...omit(itemWithoutRelations, ['data_alteracao']),
          data_alteracao: item.data_alteracao
            ? item.data_alteracao.toISOString().slice(0, 10)
            : null,
          locais: itemLocais.map((il) => ({
            id: il.localId,
            nome: il.local.nome,
            banda_instalada: il.banda_instalada,
            data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
            data_desinstalacao: il.data_desinstalacao
              ? il.data_desinstalacao.toISOString().slice(0, 10)
              : null,
            quantidade: il.quantidade,
            status: il.status,
          })),
          quantidade_total: itemLocais.reduce(
            (sum, il) => sum + il.quantidade,
            0,
          ),
          total,
          valor_count,
          instalados_count: itemLocais.length,
        }
      }),
    )
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
      ...omit(itemWithoutRelations, ['data_alteracao']),
      data_alteracao: item.data_alteracao
        ? item.data_alteracao.toISOString().slice(0, 10)
        : null,
      locais: itemLocais.map((il) => ({
        id: il.localId,
        nome: il.local.nome,
        banda_instalada: il.banda_instalada,
        data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: il.data_desinstalacao
          ? il.data_desinstalacao.toISOString().slice(0, 10)
          : null,
        quantidade: il.quantidade,
        status: il.status,
      })),
      quantidade_total: itemLocais.reduce((sum, il) => sum + il.quantidade, 0),
      total,
      valor_count,
      instalados_count: itemLocais.length,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    })
  }
}
