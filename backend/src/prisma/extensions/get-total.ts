import { Prisma } from '@prisma/client'
import { prorateTotal } from '../../utils/prorate-total'

export const getTotal = Prisma.defineExtension({
  name: 'getTotal',
  model: {
    item: {
      async total(this: any, item: any, options: { afStart: Date; afEnd: Date }) {
        const valores = await this.valor.findMany({
          where: { Item_id: item.id },
          select: { valor: true, data_inicio: true, data_fim: true },
        })
        return prorateTotal(options.afStart, options.afEnd, valores)
      },
    },
    aF: {
      async total(this: any, af: any, options?: { afStart?: Date; afEnd?: Date }) {
        const start = options?.afStart ?? af.data_inicio
        const end = options?.afEnd ?? af.data_fim

        const items = await this.item.findMany({
          where: { AF_id: af.id },
          select: { id: true },
        })

        const totals = await Promise.all(
          items.map((item: any) => this.item.total(item, { afStart: start, afEnd: end }))
        )

        return totals.reduce((sum: number, t: number) => sum + t, 0)
      },
    },
  },
})
