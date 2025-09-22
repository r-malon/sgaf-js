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

  async create(createItemDto: CreateItemDto) {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.create({
        data: {
          ...omit(createItemDto, ['valor']),
          data_instalacao: new Date(createItemDto.data_instalacao),
        },
        include: { local: { select: { nome: true } } },
      })

      await tx.valor.create({
        data: {
          valor: createItemDto.valor,
          data_inicio: new Date(createItemDto.data_instalacao),
          data_fim: null,
          itemId: item.id,
          afId: createItemDto.principalId,
        },
      })

      return {
        ...item,
        local: item.local.nome,
        data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
        total: 0,
        valor_count: 1,
      }
    })
  }

  async findOne(id: number): Promise<Item | null> {
    // principal is a temp fix, pass afId like findManyByAf
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: {
        principal: { select: { data_inicio: true, data_fim: true } },
        local: { select: { nome: true } },
      },
    })

    const total = await getItemTotal(this.prisma, item.id, item.principalId)
    const valor_count = await countValoresForItem(this.prisma, item.id)

    const { principal, local, ...itemWithoutRelations } = item
    return {
      ...itemWithoutRelations,
      local: local.nome,
      data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
      total,
      valor_count,
    }
  }

  async findManyByAf(afId: number): Promise<Item[]> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: afId },
      select: { principal: true },
    })

    let items: any[]
    if (af.principal) {
      items = await this.prisma.item.findMany({
        where: { principalId: afId },
        include: {
          local: { select: { nome: true } },
        },
      })
    } else {
      // Related AF: items via current Valor (data_fim: null)
      const currentValores = await this.prisma.valor.findMany({
        where: { afId: afId, data_fim: null },
        include: {
          item: {
            include: { local: { select: { nome: true } } },
          },
        },
      })
      // Map to unique items (assume 1 current Valor per Item-AF)
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

        const { local, ...itemWithoutRelations } = item
        return {
          ...itemWithoutRelations,
          local: local.nome,
          data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
          total,
          valor_count,
        }
      }),
    )
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.$transaction(async (tx) => {
      const now = new Date(new Date(Date.now()).setUTCHours(0, 0, 0, 0))

      const item = await tx.item.update({
        where: { id },
        data: {
          ...omit(updateItemDto, ['valor']),
          data_instalacao: updateItemDto.data_instalacao
            ? new Date(updateItemDto.data_instalacao)
            : undefined,
        },
        include: { local: { select: { nome: true } } },
      })

      await tx.valor.updateMany({
        where: { itemId: item.id, afId: item.principalId, data_fim: null },
        data: { data_fim: now },
      })

      await tx.valor.create({
        data: {
          valor: updateItemDto.valor!,
          data_inicio: now,
          data_fim: null,
          itemId: item.id,
          afId: updateItemDto.principalId!, // temp
        },
      })

      return item
    })

    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: item.principalId },
      select: { data_inicio: true, data_fim: true },
    })
    const total = await getItemTotal(
      this.prisma,
      item.id,
      updateItemDto.principalId!,
    )
    const valor_count = await countValoresForItem(
      this.prisma,
      item.id,
      updateItemDto.principalId!,
    )

    return {
      ...item,
      local: item.local.nome,
      data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
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
