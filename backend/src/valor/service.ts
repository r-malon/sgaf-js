import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/service'
import { type Valor } from '@sgaf/shared'
import { AttachToAfDto } from './dto/attach-to-af.dto'

@Injectable()
export class ValorService {
  constructor(private readonly prisma: PrismaService) {}

  async attachItemsToAf(dto: AttachToAfDto): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const af = await tx.aF.findUniqueOrThrow({ where: { id: dto.afId } })

      for (const { itemId, valor, data_inicio, data_fim } of dto.items) {
        const item = await tx.item.findUniqueOrThrow({ where: { id: itemId } })
        const principalAF = await tx.aF.findUniqueOrThrow({
          where: { id: item.principalId },
        })

        const startDate = new Date(data_inicio)
        const endDate = data_fim ? new Date(data_fim) : null

        if (
          startDate < af.data_inicio ||
          startDate < principalAF.data_inicio ||
          (endDate && endDate > af.data_fim) ||
          (endDate && endDate > principalAF.data_fim)
        ) {
          throw new Error(
            `Datas fora da AF [${af.data_inicio.toISOString().slice(0, 10)}, ${af.data_fim.toISOString().slice(0, 10)}]`,
          )
        }

        const openValor = await tx.valor.findFirst({
          where: { itemId, afId: dto.afId, data_fim: null },
        })

        if (openValor) {
          if (startDate <= openValor.data_inicio)
            throw new Error('Valor retroativo')
          await tx.valor.update({
            where: { id: openValor.id },
            data: { data_fim: startDate },
          })
        } else {
          if (startDate.getTime() !== af.data_inicio.getTime())
            throw new Error('1º Valor começa no início da AF')
        }

        await tx.valor.create({
          data: {
            valor,
            data_inicio: startDate,
            data_fim: endDate,
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
