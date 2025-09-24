import { PrismaClient } from '@prisma/client'
import { getValorTotal } from '../valor/valor.total.service'

export async function getItemTotal(
  prisma: PrismaClient,
  itemId: number,
  afId: number,
): Promise<number> {
  const valores = await prisma.valor.findMany({
    where: { itemId, afId },
    select: { id: true },
  })

  const totals = await Promise.all(
    valores.map((valor) => getValorTotal(prisma, valor.id)),
  )

  return totals.reduce((sum, t) => sum + t, 0)
}
