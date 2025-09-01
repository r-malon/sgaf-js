import { z } from 'zod'

const afBaseSchema = z.object({
  numero: z.string({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Número inválido'
        : 'Número é obrigatório',
  }).regex(/^\d+\/\d{4}$/, 'Formato obrigatório: nnn/AAAA'),
  fornecedor: z.string({
    error: () => 'Fornecedor é obrigatório',
  }).min(1),
  descricao: z.string().trim().nullish(),
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
  status: z.boolean({
    error: () => 'Status inválido',
  }),
}).refine((data) => data.data_fim >= data.data_inicio, {
  message: 'Data final não pode ser anterior à data inicial',
  path: ['data_fim'],
})

// For input DTOs
export const afSchema = afBaseSchema

// For responses
export const afWithTotalSchema = afBaseSchema.safeExtend({
  total: z.number().int().nonnegative(),
})

export type AF = z.infer<typeof afWithTotalSchema>
