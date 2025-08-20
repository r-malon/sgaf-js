import { z } from "zod"

export const localSchema = z.object({
  nome: z.string({
    error: () => "Endereço é obrigatório",
  })
  .trim()
  .min(1, "Endereço é obrigatório")
  .transform((v) =>
    v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
  ),
})

export type Local = z.infer<typeof localSchema>
