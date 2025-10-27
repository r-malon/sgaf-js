import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/service'
import { CreateContratoDto } from './dto/create-contrato.dto'
import { UpdateContratoDto } from './dto/update-contrato.dto'
import { countAFsForContrato } from './af-count.service'
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
      af_count: 0,
    }
  }

  async findOne(id: number): Promise<Contrato | null> {
    const contrato = await this.prisma.contrato.findUniqueOrThrow({
      where: { id },
    })
    const af_count = await countAFsForContrato(this.prisma, contrato.id)
    return {
      ...contrato,
      af_count,
    }
  }

  async findMany(): Promise<Contrato[]> {
    const contratos = await this.prisma.contrato.findMany()

    return Promise.all(
      contratos.map(async (contrato) => ({
        ...contrato,
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
    const af_count = await countAFsForContrato(this.prisma, contrato.id)
    return {
      ...contrato,
      af_count,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.contrato.delete({
      where: { id },
    })
  }
}
