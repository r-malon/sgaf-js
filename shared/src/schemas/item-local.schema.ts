import { z } from 'zod'

// Base schema for ItemLocal
const itemLocalBaseSchema = z.object({
  itemId: z.number().int().positive(),
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
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .nullish(),
  quantidade: z
    .number()
    .int()
    .positive('Quantidade deve ser >= 1'),
  status: z.boolean(),
})
.refine((data) => data.status || data.data_desinstalacao, {
  message: 'Data de desinstalação é obrigatória se inativo',
  path: ['data_desinstalacao'],
})
.refine(
  (data) =>
    !data.data_desinstalacao ||
    new Date(data.data_desinstalacao) >= new Date(data.data_instalacao),
  {
    message: 'Data de desinstalação deve ser posterior à instalação',
    path: ['data_desinstalacao'],
  }
)

// For creating individual ItemLocal
export const itemLocalSchema = itemLocalBaseSchema

// For bulk attachment
export const attachLocaisSchema = z.object({
  itemId: z.number().int().positive(),
  locais: z
    .array(itemLocalBaseSchema.omit({ itemId: true }))
    .min(1, 'Pelo menos um local deve ser selecionado')
    .refine(
      (data) => new Set(data.map((l) => l.localId)).size === data.length,
      {
        message: 'Locais duplicados não são permitidos',
        path: ['locais'],
      }
    ),
})

// For updates (partial)
export const updateItemLocalSchema = itemLocalBaseSchema
  .omit({ itemId: true, localId: true })
  .partial()

// For responses
export const itemLocalOutputSchema = itemLocalBaseSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  local: z
    .object({
      id: z.number().int().positive(),
      nome: z.string(),
    })
    .optional(),
  item: z
    .object({
      id: z.number().int().positive(),
      descricao: z.string().nullish(),
    })
    .optional(),
})

export type ItemLocal = z.infer<typeof itemLocalOutputSchema>
