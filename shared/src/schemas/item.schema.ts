import { z } from 'zod'

const itemBaseSchema = z.object({
  principalId: z.number().int().positive().readonly(),
  descricao: z.string().trim().nullish(),
  data_alteracao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').nullish(),
  banda_maxima: z
    .number({
      error: () => 'Banda máxima é obrigatória',
    })
    .int()
    .positive('Banda máxima deve ser >= 1'),
  quantidade_maxima: z
    .number({
      error: () => 'Quantidade máxima é obrigatória',
    })
    .int()
    .positive('Quantidade máxima deve ser >= 1'),
})

// For input DTOs
export const itemSchema = itemBaseSchema.extend({
  valor: z.number({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Valor inválido'
        : 'Valor é obrigatório',
    })
    .int()
    .nonnegative(),
})

// For ItemLocal creation/update
export const itemLocalSchema = z.object({
  localId: z.number().int().positive(),
  banda_instalada: z
    .number()
    .int()
    .nonnegative('Banda instalada deve ser >= 0'),
  data_instalacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_desinstalacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida').nullish(),
  quantidade: z
    .number()
    .int()
    .positive('Quantidade deve ser >= 1'),
  status: z.boolean(),
})
.refine((data) => !data.status && !data.data_desinstalacao, {
    message: 'Data de desinstalação é obrigatória quando inativo',
    path: ['data_desinstalacao'],
})
.refine((data) => !data.data_desinstalacao || new Date(data.data_desinstalacao) >= new Date(data.data_instalacao), {
    message: 'Data de desinstalação deve ser posterior à instalação',
    path: ['data_desinstalacao'],
})

// For bulk location attachment
export const attachLocaisSchema = z.object({
  itemId: z.number().int().positive(),
  locais: z
    .array(itemLocalSchema)
    .min(1, 'Pelo menos um local deve ser selecionado')
    .refine(
      (data) => new Set(data.map(l => l.localId)).size === data.length,
      {
        message: 'Locais duplicados não são permitidos',
        path: ['locais'],
      },
    ),
})

// For responses
export const itemOutputSchema = itemBaseSchema.extend({
  id: z.number().int().positive().readonly(),
  locais: z.array(z.object({
    id: z.number().int().positive(),
    nome: z.string(),
    banda_instalada: z.number().int().nonnegative(),
    data_instalacao: z.string(),
    quantidade: z.number().int().positive(),
    status: z.boolean(),
  })),
  quantidade_total: z.number().int().nonnegative(),
  valor_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type Item = z.infer<typeof itemOutputSchema>
export type ItemLocal = z.infer<typeof itemLocalSchema>
