import { z } from 'zod'

export const afSchema = z.object({
  numero: z.string({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Número inválido'
        : 'Número é obrigatório',
  }).regex(/^\d+\/\d{4}$/, 'Formato obrigatório: nnn/AAAA'),
  fornecedor: z.string({
    error: () => 'Fornecedor é obrigatório',
  }).min(1),
  descricao: z.string().trim().optional(),
  data_inicio: z.coerce.date({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Data de início inválida'
        : 'Data de início é obrigatória',
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
  total: z.number().int().nonnegative().optional(),
}).refine((data) => data.data_fim >= data.data_inicio, {
  message: 'Data final não pode ser anterior à data de início',
  path: ['data_fim'],
})

export type AF = z.infer<typeof afSchema>
