import { z } from 'zod'

const valorBaseSchema = z.object({
  valor: z.number({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Valor inválido'
        : 'Valor é obrigatório',
  }).int().nonnegative(),
  data_inicio: z.coerce.date({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Data inicial inválida'
        : 'Data inicial é obrigatória',
  }),
  data_fim: z.coerce.date({
    error: () => 'Data final inválida',
  }).nullish(),
}).refine(
  (data) =>
    !data.data_fim || data.data_fim >= data.data_inicio,
  {
    message: 'Data final não pode ser anterior à data inicial',
    path: ['data_fim'],
  }
)

// For input DTOs
export const valorSchema = valorBaseSchema.safeExtend({
  Item_id: z.number().int().positive(),
})

// For responses
export const valorWithoutFKSchema = valorBaseSchema

export type Valor = z.infer<typeof valorWithoutFKSchema>
