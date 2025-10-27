import { z } from 'zod'

export const afSchema = z.object({
  contratoId: z.number().int().positive().readonly(),
  numero: z
    .string({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Número inválido'
          : 'Número é obrigatório',
    })
    .regex(/^\d+\/\d{4}$/, 'Formato: número/ano'),
  descricao: z.string().trim().nullish(),
  status: z.boolean({
    error: () => 'Status inválido',
  }),
  data_inicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_fim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
})
.refine((data) => new Date(data.data_fim) >= new Date(data.data_inicio), {
  message: 'Data final deve ser posterior à data inicial',
  path: ['data_fim'],
})

// For responses
export const afOutputSchema = afSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  principal: z.boolean().readonly(),
  item_count: z.number().int().nonnegative(),
})

export type AF = z.infer<typeof afOutputSchema>
