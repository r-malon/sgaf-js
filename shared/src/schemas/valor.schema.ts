import { z } from 'zod'

export const valorBaseSchema = z.object({
  valor: z
    .number({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Valor inválido'
          : 'Valor é obrigatório',
    })
    .int()
    .nonnegative(),
  data_inicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido'),
  data_fim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido')
    .nullish(),
})
.refine(
  (data) =>
    !data.data_fim || new Date(data.data_fim) >= new Date(data.data_inicio),
  {
    message: 'Data final não pode ser anterior à data inicial',
    path: ['data_fim'],
  },
)

// For input DTOs
export const valorSchema = valorBaseSchema.safeExtend({
  Item_id: z.number().int().positive().readonly(),
})

export type Valor = z.infer<typeof valorBaseSchema>
