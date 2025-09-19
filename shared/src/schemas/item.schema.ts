import { z } from 'zod'

const itemBaseSchema = z.object({
  principal_id: z.number().int().positive().readonly(),
  Local_id: z.number().int().positive().readonly(),
  descricao: z.string().trim().nullish(),
  data_instalacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
  banda_maxima: z
    .number({
      error: () => 'Banda máxima é obrigatória',
    })
    .int()
    .positive('Banda máxima deve ser >= 1'),
  banda_instalada: z
    .number({
      error: () => 'Banda instalada é obrigatória',
    })
    .int()
    .nonnegative('Banda instalada deve ser >= 0'),
  quantidade: z
    .number({
      error: () => 'Quantidade é obrigatória',
    })
    .int()
    .positive('Quantidade deve ser >= 1'),
  status: z.boolean({
    error: () => 'Status inválido',
  }),
})

// For input DTOs
export const itemSchema = itemBaseSchema.safeExtend({
  valor: z
    .number({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Valor inválido'
          : 'Valor é obrigatório',
    })
    .int()
    .nonnegative(),
})
.refine((data) => data.banda_maxima >= data.banda_instalada, {
  message: 'Banda instalada não pode ser maior do que a banda máxima',
  path: ['banda_instalada'],
})

// For responses
export const itemOutputSchema = itemBaseSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  local: z.string(),
  valor_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type Item = z.infer<typeof itemOutputSchema>
