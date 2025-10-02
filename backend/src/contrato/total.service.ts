import { PrismaClient } from '@prisma/client'
import { getValorTotal } from '../valor/total.service'

export async function getContratoTotal(
  prisma: PrismaClient,
  contratoId: number,
): Promise<number> {
  const valores = await prisma.valor.findMany({
    where: { af: { contratoId } },
    select: { id: true },
  })

  const totals = await Promise.all(
    valores.map((valor) => getValorTotal(prisma, valor.id)),
  )

  return totals.reduce((sum, t) => sum + t, 0)
}
