import { z } from 'zod'

export const localSchema = z.object({
  nome: z.string({
    error: () => 'Endereço é obrigatório',
  })
  .trim()
  .min(5, 'Endereço deve ter min. 5 letras')
  .transform((v) => v.replace(/\s\s+/g, ' '))
})

export type Local = z.infer<typeof localSchema>
