import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { prorateTotal } from '../utils/prorate-total'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Item } from '@sgaf/shared'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { total, ...data } = createItemDto as any
    const item = await this.prisma.item.create({
      data,
    })

    return item
  }

  async findOne(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: { af: true },
    })

    const total = await this.prisma.item.total(item)
    return { ...item, total }
  }

  async findMany(): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      include: { af: true },
    })

    return Promise.all(
      items.map(async item => ({ ...item, total: await this.prisma.item.total(item) }))
    )
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const { total, ...data } = updateItemDto as any
    const item = await this.prisma.item.update({
      where: { id },
      data,
    })

    return item
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    })
  }
}
