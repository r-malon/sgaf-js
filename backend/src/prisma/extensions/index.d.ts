import type { Prisma, AF, Item } from '@prisma/client'

declare module '@prisma/client' {
  namespace Prisma {
    interface AFDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
      total(
        af: AF,
        options?: { afStart?: Date; afEnd?: Date }
      ): Promise<number>
    }

    interface ItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
      total(
        item: Item,
        options?: { afStart?: Date; afEnd?: Date }
      ): Promise<number>
    }
  }
}
