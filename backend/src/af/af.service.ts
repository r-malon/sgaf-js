import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAfDto } from './dto/create-af.dto'
import { UpdateAfDto } from './dto/update-af.dto'
import { getAfTotal } from './af.total.service'
import { countItemsForAF } from './af.item-count.service'
import { type AF } from '@sgaf/shared'

@Injectable()
export class AfService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAfDto: CreateAfDto): Promise<AF> {
    const existingCount = await this.prisma.aF.count({
      where: { Contrato_id: createAfDto.Contrato_id },
    })
    const af = await this.prisma.aF.create({
      data: {
        ...createAfDto,
        principal: existingCount === 0,
        data_inicio: new Date(createAfDto.data_inicio),
        data_fim: new Date(createAfDto.data_fim),
      },
    })
    return {
      ...af,
      data_inicio: af.data_inicio.toISOString().slice(0, 10),
      data_fim: af.data_fim.toISOString().slice(0, 10),
      total: 0,
      item_count: 0,
    }
  }

  async findOne(id: number): Promise<AF | null> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id },
    })
    const total = await getAfTotal(this.prisma, af.id)
    const item_count = await countItemsForAF(this.prisma, af.id)
    return {
      ...af,
      data_inicio: af.data_inicio.toISOString().slice(0, 10),
      data_fim: af.data_fim.toISOString().slice(0, 10),
      total,
      item_count,
    }
  }

  async findMany(): Promise<AF[]> {
    const afs = await this.prisma.aF.findMany()

    return Promise.all(
      afs.map(async (af) => ({
        ...af,
        data_inicio: af.data_inicio.toISOString().slice(0, 10),
        data_fim: af.data_fim.toISOString().slice(0, 10),
        total: await getAfTotal(this.prisma, af.id),
        item_count: await countItemsForAF(this.prisma, af.id),
      })),
    )
  }

  async findManyByContrato(contratoId: number): Promise<AF[]> {
    const afs = await this.prisma.aF.findMany({
      where: { Contrato_id: contratoId },
    })

    return Promise.all(
      afs.map(async (af) => {
        const total = await getAfTotal(this.prisma, af.id)
        const item_count = await countItemsForAF(this.prisma, af.id)

        return {
          ...af,
          data_inicio: af.data_inicio.toISOString().slice(0, 10),
          data_fim: af.data_fim.toISOString().slice(0, 10),
          total,
          item_count,
        }
      }),
    )
  }

  async update(id: number, updateAfDto: UpdateAfDto): Promise<AF> {
    const af = await this.prisma.aF.update({
      where: { id },
      data: {
        ...updateAfDto,
        data_inicio: updateAfDto.data_inicio
          ? new Date(updateAfDto.data_inicio)
          : undefined,
        data_fim: updateAfDto.data_fim
          ? new Date(updateAfDto.data_fim)
          : undefined,
      },
    })
    const total = await getAfTotal(this.prisma, af.id)
    const item_count = await countItemsForAF(this.prisma, af.id)
    return {
      ...af,
      data_inicio: af.data_inicio.toISOString().slice(0, 10),
      data_fim: af.data_fim.toISOString().slice(0, 10),
      total,
      item_count,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.aF.delete({
      where: { id },
    })
  }
}
