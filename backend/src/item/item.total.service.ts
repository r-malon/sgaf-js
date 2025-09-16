import { PrismaClient } from '@prisma/client'
import { prorateTotal } from '../utils/prorate-total'

export async function getItemTotal(
  prisma: PrismaClient,
  itemId: number,
  options?: { afStart?: Date; afEnd?: Date },
): Promise<number> {
  let { afStart: start, afEnd: end } = options || {}

  if (!start || !end) {
    const item = await prisma.item.findUniqueOrThrow({
      where: { id: itemId },
      select: { AF_id: true },
    })

    const af = await prisma.aF.findUniqueOrThrow({
      where: { id: item.AF_id },
      select: { data_inicio: true, data_fim: true },
    })

    start ??= af.data_inicio
    end ??= af.data_fim
  }

  const valores = await prisma.valor.findMany({
    where: { Item_id: itemId },
    select: { valor: true, data_inicio: true, data_fim: true },
  })

  const formattedValores = valores.map((valor) => ({
    ...valor,
    data_inicio: valor.data_inicio.toISOString().slice(0, 10),
    data_fim: valor.data_fim ? valor.data_fim.toISOString().slice(0, 10) : null,
  }))

  return prorateTotal(start!, end!, formattedValores)
}
