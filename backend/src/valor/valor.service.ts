import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { type Valor } from '@sgaf/shared'

@Injectable()
export class ValorService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<Valor[]> {
    const valores = await this.prisma.valor.findMany()
    return valores.map((valor) => ({
      ...valor,
      data_inicio: valor.data_inicio.toISOString().slice(0, 10),
      data_fim: valor.data_fim
        ? valor.data_fim.toISOString().slice(0, 10)
        : null,
    }))
  }

  async findManyByItem(itemId: number): Promise<Valor[]> {
    const valores = await this.prisma.valor.findMany({
      where: { Item_id: itemId },
    })
    return valores.map((valor) => ({
      ...valor,
      data_inicio: valor.data_inicio.toISOString().slice(0, 10),
      data_fim: valor.data_fim
        ? valor.data_fim.toISOString().slice(0, 10)
        : null,
    }))
  }

  async findOne(id: number): Promise<Valor | null> {
    const valor = await this.prisma.valor.findUniqueOrThrow({
      where: { id },
    })
    return {
      ...valor,
      data_inicio: valor.data_inicio.toISOString().slice(0, 10),
      data_fim: valor.data_fim
        ? valor.data_fim.toISOString().slice(0, 10)
        : null,
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.valor.delete({
      where: { id },
    })
  }
}
