import { PrismaClient } from '@prisma/client'

export async function countValoresForItem(
  prisma: PrismaClient,
  itemId: number,
  afId?: number,
): Promise<number> {
  const where = { Item_id: itemId }
  if (afId) where['AF_id'] = afId

  return await prisma.valor.count({ where })
}
