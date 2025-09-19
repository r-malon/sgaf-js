import { PrismaClient } from '@prisma/client'
import { prorateTotal } from '../utils/prorate-total'

export async function getItemTotal(
  prisma: PrismaClient,
  itemId: number,
  afId: number,
): Promise<number> {
  const af = await prisma.aF.findUniqueOrThrow({
    where: { id: afId },
    select: { data_inicio: true, data_fim: true },
  })

  const valores = await prisma.valor.findMany({
    where: { Item_id: itemId, AF_id: afId },
    select: { valor: true, data_inicio: true, data_fim: true },
  })

  const formattedValores = valores.map((valor) => ({
    ...valor,
    data_inicio: valor.data_inicio.toISOString().slice(0, 10),
    data_fim: valor.data_fim ? valor.data_fim.toISOString().slice(0, 10) : null,
  }))

  return prorateTotal(af.data_inicio, af.data_fim, formattedValores)
}
