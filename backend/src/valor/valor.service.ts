import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { type Valor } from '@sgaf/shared'
import { AttachToAfDto } from './dto/attach-to-af.dto'

@Injectable()
export class ValorService {
  constructor(private readonly prisma: PrismaService) {}

  async attachItemsToAf(dto: AttachToAfDto): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const now = new Date(new Date(Date.now()).setUTCHours(0, 0, 0, 0))

      for (const { itemId, valor, data_inicio, data_fim } of dto.items) {
        // Close any existing open Valor for this Item-AF pair
        await tx.valor.updateMany({
          where: {
            data_fim: null,
            itemId,
            afId: dto.afId,
          },
          data: { data_fim: now },
        })

        await tx.valor.create({
          data: {
            valor,
            data_inicio: new Date(data_inicio),
            data_fim: data_fim ? new Date(data_fim) : null,
            itemId,
            afId: dto.afId,
          },
        })
      }
    })
  }

  async findMany(itemId: number, afId: number): Promise<Valor[]> {
    const valores = await this.prisma.valor.findMany({
      where: { itemId, afId },
    })
    return valores.map((valor) => ({
      ...valor,
      data_inicio: valor.data_inicio.toISOString().slice(0, 10),
      data_fim: valor.data_fim
        ? valor.data_fim.toISOString().slice(0, 10)
        : null,
    }))
  }

  async delete(id: number): Promise<void> {
    await this.prisma.valor.delete({
      where: { id },
    })
  }
}
