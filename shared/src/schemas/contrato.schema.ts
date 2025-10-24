import { z } from 'zod'

const contratoBaseSchema = z.object({
  numero: z
    .string({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Número inválido'
          : 'Número é obrigatório',
    })
    .regex(/^\d+\/\d{4}$/, 'Formato: número/ano'),
  fornecedor: z
    .string({
      error: () => 'Fornecedor é obrigatório',
    })
    .trim()
    .min(1)
    .transform((v) => v.replace(/\s\s+/g, ' ')),
  cpf: z
    .string({
      error: () => 'CPF/CNPJ é obrigatório',
    })
    .trim()
    .min(1)
    .regex(
      /^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$/g,
      'CPF/CNPJ inválido',
    ),
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
