import { z } from 'zod'
import { instalacaoOutputSchema } from './instalacao.schema'

const itemBaseSchema = z.object({
  principalId: z.number().int().positive().readonly(),
  descricao: z.string().trim().nullish(),
  data_alteracao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .nullish(),
  banda_maxima: z
    .number({
      error: () => 'Banda máxima é obrigatória',
    })
    .int()
    .nonnegative('Banda máxima deve ser >= 0'),
  quantidade_maxima: z
    .number({
      error: () => 'Quantidade máxima é obrigatória',
    })
    .int()
    .positive('Quantidade máxima deve ser >= 1'),
})

export const itemSchema = itemBaseSchema.extend({
  valor: z
    .number({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'Valor inválido' : 'Valor é obrigatório',
    })
    .int()
    .nonnegative(),
})

export const itemOutputSchema = itemBaseSchema.extend({
  id: z.number().int().positive().readonly(),
  instalacoes: z.array(
    instalacaoOutputSchema.pick({
      id: true,
      localId: true,
      quantidade: true,
    })
  ),
  quantidade_total: z.number().int().nonnegative(),
  valor_count: z.number().int().nonnegative(),
  instalados_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type Item = z.infer<typeof itemOutputSchema>
