import { PrismaClient } from '@prisma/client'

export async function countItemsForAF(
  prisma: PrismaClient,
  afId: number,
): Promise<number> {
  const af = await prisma.aF.findUnique({
    where: {
      id: afId,
    },
    select: {
      _count: {
        select: { items: true },
      },
    },
  })
  return af?._count.items ?? 0
}
