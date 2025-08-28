import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { prorateTotal } from '../utils/prorate-total'
import { CreateAfDto } from './dto/create-af.dto'
import { UpdateAfDto } from './dto/update-af.dto'
import { AF, Item } from '@sgaf/shared'

@Injectable()
export class AfService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAfDto: CreateAfDto): Promise<AF> {
    const { total, ...data } = createAfDto as any
    const af = await this.prisma.aF.create({
      data,
    })

    return af
  }

  async findOne(id: number): Promise<AF | null> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id },
      include: { items: true },
    })

    const total = await this.prisma.aF.total(af)
    return { ...af, total }
  }

  async findMany(): Promise<AF[]> {
    const afs = await this.prisma.aF.findMany({
      include: { items: true },
    })

    return Promise.all(
      afs.map(async af => ({ ...af, total: await this.prisma.aF.total(af) }))
    )
  }

  async update(id: number, updateAfDto: UpdateAfDto): Promise<AF> {
    const { total, ...data } = updateAfDto as any
    const af = await this.prisma.aF.update({
      where: { id },
      data,
    })

    return af
  }

  async delete(id: number): Promise<void> {
    await this.prisma.aF.delete({
      where: { id },
    })
  }
}
