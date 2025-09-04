import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { getItemTotal } from './item.total.service'
import { Item } from '@sgaf/shared'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: createItemDto.AF_id },
      select: { data_inicio: true, data_fim: true, status: true },
    })

    if (!af.status)
      throw new Error('Itens não podem ser adicionados à AF inativa')

    const item = await this.prisma.item.create({
      data: createItemDto,
    })

    const total = await getItemTotal(this.prisma, item.id, {
      afStart: af.data_inicio,
      afEnd: af.data_fim,
    })

    return { ...item, total }
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

    const { af, ...itemWithoutRelations } = item
    return { ...itemWithoutRelations, total }
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

        const { af, ...itemWithoutRelations } = item
        return { ...itemWithoutRelations, total }
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
        const { af, ...itemWithoutRelations } = item
        return { ...itemWithoutRelations, total }
      }),
    )
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    })

    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: item.AF_id },
      select: { data_inicio: true, data_fim: true },
    })

    const total = await getItemTotal(this.prisma, item.id, {
      afStart: af.data_inicio,
      afEnd: af.data_fim,
    })

    return { ...item, total }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    })
  }
}
