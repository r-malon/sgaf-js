import { z } from 'zod'

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

// For input DTOs
export const itemSchema = itemBaseSchema.extend({
  valor: z
    .number({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'Valor inválido' : 'Valor é obrigatório',
    })
    .int()
    .nonnegative(),
})

// For responses
export const itemOutputSchema = itemBaseSchema.extend({
  id: z.number().int().positive().readonly(),
  locais: z.array(
    z.object({
      id: z.number().int().positive(),
      nome: z.string(),
      banda_instalada: z.number().int().nonnegative(),
      data_instalacao: z.string(),
      data_desinstalacao: z.string().nullish(),
      quantidade: z.number().int().positive(),
      status: z.boolean(),
    })
  ),
  quantidade_total: z.number().int().nonnegative(),
  valor_count: z.number().int().nonnegative(),
  instalados_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type Item = z.infer<typeof itemOutputSchema>
