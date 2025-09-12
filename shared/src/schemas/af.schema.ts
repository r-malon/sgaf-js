import { z } from 'zod'

const afBaseSchema = z.object({
  Contrato_id: z.number().int().positive().readonly(),
  principal: z.boolean({
    error: () => 'Status inválido',
  }),
  numero: z
    .string({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Número inválido'
          : 'Número é obrigatório',
    })
    .regex(/^\d+\/\d{4}$/, 'Formato obrigatório: nnn/AAAA'),
  fornecedor: z
    .string({
      error: () => 'Fornecedor é obrigatório',
    })
    .min(1),
  descricao: z.string().trim().nullish(),
  status: z.boolean({
    error: () => 'Status inválido',
  }),
})

// For input DTOs
export const afSchema = afBaseSchema
  .safeExtend({
    data_inicio: z.coerce.date({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Data inicial inválida'
          : 'Data inicial é obrigatória',
    }),
    data_fim: z.coerce.date({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Data final inválida'
          : 'Data final é obrigatória',
    }),
  })
  .refine((data) => data.data_fim >= data.data_inicio, {
    message: 'Data final não pode ser anterior à data inicial',
    path: ['data_fim'],
  })

// For responses
export const afOutputSchema = afBaseSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  data_inicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
  item_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type AF = z.infer<typeof afOutputSchema>
