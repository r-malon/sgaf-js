import { z } from 'zod'

export const localSchema = z.object({
  nome: z
    .string({
      error: () => 'Endereço é obrigatório',
    })
    .trim()
    .min(5, 'Endereço deve ter min. 5 letras')
    .transform((v) => v.replace(/\s\s+/g, ' ')),
})

// For responses
export const localOutputSchema = localSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  instalados_count: z.number().int().nonnegative(),
})

export type Local = z.infer<typeof localOutputSchema>
