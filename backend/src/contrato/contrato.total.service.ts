import { PrismaClient } from '@prisma/client'
import { getAfTotal } from '../af/af.total.service'

export async function getContratoTotal(
  prisma: PrismaClient,
  contratoId: number,
): Promise<number> {
  const contrato = await prisma.contrato.findUniqueOrThrow({
    where: { id: contratoId },
  })

  const afs = await prisma.aF.findMany({
    where: { Contrato_id: contratoId },
    select: { id: true },
  })

  const totals = await Promise.all(afs.map((af) => getAfTotal(prisma, af.id)))

  return totals.reduce((sum, t) => sum + t, 0)
}
