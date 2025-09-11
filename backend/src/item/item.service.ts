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
        data: omit(createItemDto, ['valor']),
      })

      await tx.valor.create({
        data: {
          valor: createItemDto.valor,
          data_inicio: createItemDto.data_instalacao,
          data_fim: null,
          Item_id: item.id,
        },
      })

      return {
        ...item,
        data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
        total: 0,
        valor_count: 1,
      }
    })
  }

  async findOne(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: { af: { select: { data_inicio: true, data_fim: true } } },
    })

    const total = await getItemTotal(this.prisma, item.id, {
      afStart: item.af.data_inicio,
      afEnd: item.af.data_fim,
    })
    const valor_count = await countValoresForItem(this.prisma, item.id)

    const { af, ...itemWithoutRelations } = item
    return {
      ...itemWithoutRelations,
      data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
      total,
      valor_count,
    }
  }

  async findMany(): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      include: { af: { select: { data_inicio: true, data_fim: true } } },
    })

    return Promise.all(
      items.map(async (item) => {
        const total = await getItemTotal(this.prisma, item.id, {
          afStart: item.af.data_inicio,
          afEnd: item.af.data_fim,
        })
        const valor_count = await countValoresForItem(this.prisma, item.id)

        const { af, ...itemWithoutRelations } = item
        return {
          ...itemWithoutRelations,
          data_instalacao: item.data_instalacao.toISOString().slice(0, 10),
          total,
          valor_count,
        }
      }),
    )
  }

  async findManyByAf(afId: number): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      where: { AF_id: afId },
      include: { af: { select: { data_inicio: true, data_fim: true } } },
    })

    return Promise.all(
      items.map(async (item) => {
        const total = await getItemTotal(this.prisma, item.id, {
          afStart: item.af.data_inicio,
          afEnd: item.af.data_fim,
        })
        const valor_count = await countValoresForItem(this.prisma, item.id)

        const { af, ...itemWithoutRelations } = item
        return {
          ...itemWithoutRelations,
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
        data: omit(updateItemDto, ['valor']),
      })

      await tx.valor.updateMany({
        where: { Item_id: item.id, data_fim: null },
        data: {
          data_fim: now,
        },
      })

      await tx.valor.create({
        data: {
          valor: updateItemDto.valor!,
          data_inicio: now,
          data_fim: null,
          Item_id: item.id,
        },
      })

      return item
    })

    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: item.AF_id },
      select: { data_inicio: true, data_fim: true },
    })

    const total = await getItemTotal(this.prisma, item.id, {
      afStart: af.data_inicio,
      afEnd: af.data_fim,
    })
    const valor_count = await countValoresForItem(this.prisma, item.id)

    return {
      ...item,
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
