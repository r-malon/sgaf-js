import { z } from 'zod'

const itemBaseSchema = z.object({
  descricao: z.string().trim().nullish(),
  data_instalacao: z.coerce.date({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Data de instalação inválida'
        : 'Data de instalação é obrigatória',
  }),
  banda_maxima: z.number({
    error: () => 'Banda máxima é obrigatória',
  }).int().positive('Banda máxima deve ser >= 1'),
  banda_instalada: z.number({
    error: () => 'Banda instalada é obrigatória',
  }).int().nonnegative('Banda instalada deve ser >= 0'),
  quantidade: z.number({
    error: () => 'Quantidade é obrigatória',
  }).int().positive('Quantidade deve ser >= 1'),
  status: z.boolean({
    error: () => 'Status inválido',
  }),
})

// For input DTOs
export const itemSchema = itemBaseSchema.safeExtend({
  AF_id: z.number().int().positive().readonly(),
  Local_id: z.number().int().positive().readonly(),
})

// For responses
export const itemWithTotalSchema = itemBaseSchema.safeExtend({
  total: z.number().int().nonnegative(),
})

export type Item = z.infer<typeof itemWithTotalSchema>
