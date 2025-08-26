import { Prisma } from '@prisma/client'

function normalize(str: string) {
  return str
    .normalize('NFD') // split accents
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s\s+/g, ' ')
    .toLowerCase()
}

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
              // use contains for flexible search
              nome: {
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
