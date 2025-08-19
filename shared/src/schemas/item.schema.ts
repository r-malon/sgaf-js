import { z } from "zod"

export const itemSchema = z.object({
  id: z.number().int().positive().optional(),
  AF_id: z.number().int().positive(),
  Local_id: z.number().int().positive(),
  descricao: z.string().trim().optional(),
  data_instalacao: z.coerce.date({
    error: (issue) =>
      issue.code === "invalid_type"
        ? "Data de instalação inválida"
        : "Data de instalação é obrigatória",
  }),
  banda_maxima: z.number({
    error: () => "Banda máxima é obrigatória",
  }).int().positive("Banda máxima deve ser >= 1"),
  banda_instalada: z.number({
    error: () => "Banda instalada é obrigatória",
  }).int().nonnegative("Banda instalada deve ser >= 0"),
  quantidade: z.number({
    error: () => "Quantidade é obrigatória",
  }).int().positive("Quantidade deve ser >= 1"),
  status: z.boolean({
    error: () => "Status inválido",
  }),
})

export type Item = z.infer<typeof itemSchema>
