import { z } from 'zod'

export const valorSchema = z.object({
  Item_id: z.number().int().positive(),
  valor: z.number({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Valor inválido'
        : 'Valor é obrigatório',
  }).int().nonnegative(),
  data_inicio: z.coerce.date({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Data de início inválida'
        : 'Data de início é obrigatória',
  }),
  data_fim: z.coerce.date({
    error: () => 'Data final inválida',
  }).nullish(),
}).refine(
  (data) =>
    !data.data_fim || data.data_fim >= data.data_inicio,
  {
    message: 'Data final não pode ser anterior à data de início',
    path: ['data_fim'],
  }
)

export type Valor = z.infer<typeof valorSchema>
