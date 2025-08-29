import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Item } from '@sgaf/shared'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}
  private async getAfWindowForItem(itemLike: { id?: number; AF_id?: number; af?: any }) {
    if (itemLike.af?.data_inicio && itemLike.af?.data_fim) {
      return { afStart: itemLike.af.data_inicio, afEnd: itemLike.af.data_fim }
    }
    const afId = itemLike.AF_id ?? (itemLike.id ? undefined : undefined)

    if (itemLike.AF_id) {
      const af = await this.prisma.aF.findUniqueOrThrow({ where: { id: itemLike.AF_id } })
      return { afStart: af.data_inicio, afEnd: af.data_fim }
    }
    if (itemLike.id) {
      const itemWithAf = await this.prisma.item.findUniqueOrThrow({
        where: { id: itemLike.id },
        include: { af: true },
      })
      return { afStart: itemWithAf.af.data_inicio, afEnd: itemWithAf.af.data_fim }
    }
    throw new NotFoundException('Item or AF information is missing to compute total')
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = await this.prisma.item.create({
      data: createItemDto as any,
    })

    const { afStart, afEnd } = await this.getAfWindowForItem({ id: item.id })
    const total = await this.prisma.item.total(item, { afStart, afEnd })
    return { ...item, total }
  }

  async findOne(id: number): Promise<Item | null> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: { af: true },
    })

    const { afStart, afEnd } = await this.getAfWindowForItem(item as any)
    const total = await this.prisma.item.total(item as any, { afStart, afEnd })
    return { ...item, total }
  }

  async findMany(): Promise<Item[]> {
    const items = await this.prisma.item.findMany({
      include: { af: true },
    })

    return Promise.all(
      items.map(async item => {
        const { afStart, afEnd } = await this.getAfWindowForItem(item as any)
        const total = await this.prisma.item.total(item as any, { afStart, afEnd })
        return { ...item, total }
      })
    )
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id },
      data: updateItemDto as any,
    })

    const { afStart, afEnd } = await this.getAfWindowForItem({ id: item.id })
    const total = await this.prisma.item.total(item, { afStart, afEnd })
    return { ...item, total }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({
      where: { id },
    })
  }
}
