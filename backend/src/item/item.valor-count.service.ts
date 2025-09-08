import { PrismaClient } from '@prisma/client'

export async function countValoresForItem(
  prisma: PrismaClient,
  itemId: number,
): Promise<number> {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    select: {
      _count: {
        select: { valores: true },
      },
    },
  })
  return item?._count.valores ?? 0
}
