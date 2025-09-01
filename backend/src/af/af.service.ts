import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAfDto } from './dto/create-af.dto'
import { UpdateAfDto } from './dto/update-af.dto'
import { getAfTotal } from './af.total.service'
import { AF } from '@sgaf/shared'

@Injectable()
export class AfService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAfDto: CreateAfDto): Promise<AF> {
    const af = await this.prisma.aF.create({
      data: createAfDto,
    })
    const total = await getAfTotal(this.prisma, af.id)
    return { ...af, total }
  }

  async findOne(id: number): Promise<AF | null> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id },
    })
    const total = await getAfTotal(this.prisma, af.id)
    return { ...af, total }
  }

  async findMany(): Promise<AF[]> {
    const afs = await this.prisma.aF.findMany()

    return Promise.all(
      afs.map(async af => ({
        ...af,
        total: await getAfTotal(this.prisma, af.id),
      }))
    )
  }

  async update(id: number, updateAfDto: UpdateAfDto): Promise<AF> {
    const af = await this.prisma.aF.update({
      where: { id },
      data: updateAfDto,
    })
    const total = await getAfTotal(this.prisma, af.id)
    return { ...af, total }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.aF.delete({
      where: { id },
    })
  }
}
