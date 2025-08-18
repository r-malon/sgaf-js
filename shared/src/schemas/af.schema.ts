import { z } from "zod"

export const afSchema = z.object({
  numero: z.string().regex(/^\d+\/\d{4}$/, {
    message: "Número deve ter dígitos, barra e ano (ex: 123/2025)",
  }),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  descricao: z.string().trim().optional(),
  data_inicio: z.coerce.date({
    required_error: "Data de início é obrigatória",
    invalid_type_error: "Data de início inválida",
  }),
  data_fim: z.coerce.date({
    required_error: "Data de fim é obrigatória",
    invalid_type_error: "Data de fim inválida",
  }),
  status: z.boolean(),
}).refine((data) => data.data_fim >= data.data_inicio, {
  message: "Data de fim não pode ser anterior à data de início",
  path: ["data_fim"],
})

export type AF = z.infer<typeof afSchema>

