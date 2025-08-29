import { Prisma } from '@prisma/client'
import { normalize } from '../../utils/normalize'

export const normalizeLocal = Prisma.defineExtension({
  name: 'normalizeLocal',
  query: {
    local: {
      async create({ args, query }) {
        if (args.data.nome) {
          args.data.nome_normalized = normalize(args.data.nome)
        }
        return query(args)
      },
      async update({ args, query }) {
        if (args.data.nome) {
          args.data.nome_normalized = normalize(args.data.nome)
        }
        return query(args)
      },
    },
  },
})
