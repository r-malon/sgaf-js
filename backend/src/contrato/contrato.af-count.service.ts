import { PrismaClient } from '@prisma/client'

export async function countAFsForContrato(
  prisma: PrismaClient,
  contratoId: number,
): Promise<number> {
  const contrato = await prisma.contrato.findUniqueOrThrow({
    where: {
      id: contratoId,
    },
    select: {
      _count: {
        select: { afs: true },
      },
    },
  })
  return contrato?._count.afs ?? 0
}
