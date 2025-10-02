import { PrismaClient } from '@prisma/client'

export async function countItemsForAF(
  prisma: PrismaClient,
  afId: number,
): Promise<number> {
  return await prisma.valor.count({ where: { afId } })
}
