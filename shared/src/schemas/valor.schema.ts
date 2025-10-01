import { z } from 'zod'

const valorBaseSchema = z.object({
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
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  data_fim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
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
  afId: z.number().int().positive().readonly(),
  itemId: z.number().int().positive().readonly(),
})

// For bulk attach items (no per-item afId)
const attachItemPayloadSchema = valorBaseSchema.safeExtend({
  itemId: z.number().int().positive().readonly(),
})

export const attachToAfSchema = z.object({
  afId: z.number().int().positive().readonly(),
  items: z
    .array(attachItemPayloadSchema)
    .min(1, 'Pelo menos um item deve ser selecionado')
    .refine(
      (data) => new Set(data.map(i => i.itemId)).size === data.length,
      {
        message: 'Itens duplicados não são permitidos',
        path: ['items'],
      },
    ),
})

export type Valor = z.infer<typeof valorBaseSchema>
