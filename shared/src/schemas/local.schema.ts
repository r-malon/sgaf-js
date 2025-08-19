import { z } from "zod"

export const localSchema = z.object({
  nome: z.string({
    error: () => "Nome é obrigatório",
  }).trim().min(1, "Nome do local é obrigatório"),
})

export type Local = z.infer<typeof localSchema>
