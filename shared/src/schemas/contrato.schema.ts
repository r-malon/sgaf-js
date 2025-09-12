import { z } from 'zod'

const contratoBaseSchema = z.object({
  numero: z
    .string({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Número inválido'
          : 'Número é obrigatório',
    })
    .regex(/^\d+\/\d{4}$/, 'Formato obrigatório: nnn/AAAA'),
  nome: z
    .string({
      error: () => 'Nome é obrigatório',
    })
    .trim()
    .min(1)
    .transform((v) => v.replace(/\s\s+/g, ' ')),
  endereco: z
    .string({
      error: () => 'Endereço é obrigatório',
    })
    .trim()
    .min(1)
    .transform((v) => v.replace(/\s\s+/g, ' ')),
  cpf: z
    .string({
      error: () => 'CPF é obrigatório',
    })
    .trim()
    .min(1)
    .transform((v) => v.replace(/\s\s+/g, ' ')),
})

// For input DTOs
export const contratoSchema = contratoBaseSchema

// For responses
export const contratoOutputSchema = contratoBaseSchema.safeExtend({
  id: z.number().int().positive().readonly(),
  af_count: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
})

export type Contrato = z.infer<typeof contratoOutputSchema>
