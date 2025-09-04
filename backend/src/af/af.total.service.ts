import { PrismaClient } from '@prisma/client'
import { prorateTotal } from '../utils/prorate-total'
import { getItemTotal } from '../item/item.total.service'

export async function getAfTotal(
  prisma: PrismaClient,
  afId: number,
): Promise<number> {
  const af = await prisma.aF.findUniqueOrThrow({
    where: { id: afId },
    select: { data_inicio: true, data_fim: true },
  })

  const items = await prisma.item.findMany({
    where: { AF_id: afId },
    select: { id: true },
  })

  const totals = await Promise.all(
    items.map((item) =>
      getItemTotal(prisma, item.id, {
        afStart: af.data_inicio,
        afEnd: af.data_fim,
      }),
    ),
  )

  return totals.reduce((sum, t) => sum + t, 0)
}
