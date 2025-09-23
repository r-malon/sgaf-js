import { PrismaClient } from '@prisma/client'
import { getItemTotal } from '../item/item.total.service'

export async function getAfTotal(
  prisma: PrismaClient,
  afId: number,
): Promise<number> {
  const items = await prisma.item.findMany({ select: { id: true } })

  const totals = await Promise.all(
    items.map((item) => getItemTotal(prisma, item.id, afId)),
  )

  return totals.reduce((sum, t) => sum + t, 0)
}
