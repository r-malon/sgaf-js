import { PrismaClient } from '@prisma/client'

export async function countValoresForItem(
  prisma: PrismaClient,
  itemId: number,
  afId?: number,
): Promise<number> {
  const where = { itemId }
  if (afId) where['afId'] = afId

  return await prisma.valor.count({ where })
}
