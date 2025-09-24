import { PrismaClient } from '@prisma/client'
import { getValorTotal } from '../valor/valor.total.service'

export async function getAfTotal(
  prisma: PrismaClient,
  afId: number,
): Promise<number> {
  const valores = await prisma.valor.findMany({
    where: { afId },
    select: { id: true },
  })

  const totals = await Promise.all(
    valores.map((valor) => getValorTotal(prisma, valor.id)),
  )

  return totals.reduce((sum, t) => sum + t, 0)
}
