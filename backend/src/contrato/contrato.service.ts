import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateContratoDto } from './dto/create-contrato.dto'
import { UpdateContratoDto } from './dto/update-contrato.dto'
import { getContratoTotal } from './contrato.total.service'
import { countAFsForContrato } from './contrato.af-count.service'
import { type Contrato } from '@sgaf/shared'

@Injectable()
export class ContratoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContratoDto: CreateContratoDto): Promise<Contrato> {
    const contrato = await this.prisma.contrato.create({
      data: createContratoDto,
    })
    return {
      ...contrato,
      total: 0,
      af_count: 0,
    }
  }

  async findOne(id: number): Promise<Contrato | null> {
    const contrato = await this.prisma.contrato.findUniqueOrThrow({
      where: { id },
    })
    const total = await getContratoTotal(this.prisma, contrato.id)
    const af_count = await countAFsForContrato(this.prisma, contrato.id)
    return {
      ...contrato,
      total,
      af_count,
    }
  }

  async findMany(): Promise<Contrato[]> {
    const contratos = await this.prisma.contrato.findMany()

    return Promise.all(
      contratos.map(async (contrato) => ({
        ...contrato,
        total: await getContratoTotal(this.prisma, contrato.id),
        af_count: await countAFsForContrato(this.prisma, contrato.id),
      })),
    )
  }

  async update(
    id: number,
    updateContratoDto: UpdateContratoDto,
  ): Promise<Contrato> {
    const contrato = await this.prisma.contrato.update({
      where: { id },
      data: updateContratoDto,
    })
    const total = await getContratoTotal(this.prisma, contrato.id)
    const af_count = await countAFsForContrato(this.prisma, contrato.id)
    return {
      ...contrato,
      total,
      af_count,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.contrato.delete({
      where: { id },
    })
  }
}
