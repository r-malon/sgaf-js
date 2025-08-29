import { AF, Item, Valor } from '@prisma/client'

declare module '@prisma/client' {
  interface PrismaClient {
    aF: {
      total(
        af: AF,
        options?: { afStart?: Date; afEnd?: Date }
      ): Promise<number>
    } & PrismaClient['aF']
    item: {
      total(
        item: Item,
        options: { afStart: Date; afEnd: Date }
      ): Promise<number>
    } & PrismaClient['item']
  }
}
