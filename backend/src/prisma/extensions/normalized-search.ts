import { Prisma } from '@prisma/client'
import { normalize } from '../../utils/normalize'

export const normalizedSearch = Prisma.defineExtension({
  name: 'normalizedSearch',
  query: {
    local: {
      async findMany({ args, query }) {
        if (args.where?.nome && typeof args.where.nome === 'string') {
          const normalized = normalize(args.where.nome)
          return query({
            ...args,
            where: {
              ...args.where,
              nome_normalized: {
                contains: normalized,
                mode: 'insensitive',
              },
            },
          })
        }
        return query(args)
      },
    },
  },
})
