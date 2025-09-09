import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Valor } from '@sgaf/shared'

@Injectable()
export class ValorService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<Valor[]> {
    const valores: Valor[] = await this.prisma.valor.findMany()

    return valores
  }

  async findManyByItem(itemId: number): Promise<Valor[]> {
    const valores: Valor[] = await this.prisma.valor.findMany({
      where: { Item_id: itemId },
    })

    return valores
  }

  async findOne(id: number): Promise<Valor | null> {
    const valor = await this.prisma.valor.findUniqueOrThrow({
      where: { id },
    })

    return valor
  }

  async delete(id: number): Promise<void> {
    await this.prisma.valor.delete({
      where: { id },
    })
  }
}
