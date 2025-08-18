"use client"

import * as React from "react"
import { z } from "zod"
import { GenericDialogForm } from "@/components/generic-dialog-form"
import { useEntityHandlers } from "@/app/handlers"
import { API_BASE_URL } from "@/lib/config"
import { mutate } from "swr"

const afSchema = z.object({
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

interface AFDialogProps {
  af?: any
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: any) => Promise<void>
}

export function AFDialog({
  af,
  triggerLabel = "Nova AF",
  title,
  onSubmit,
}: AFDialogProps) {
  const isEdit = !!af
  const { handleCreate, handleEdit } = useEntityHandlers("af")

  return (
    <GenericDialogForm
      schema={afSchema}
      defaultValues={{
        numero: af?.numero ?? "",
        fornecedor: af?.fornecedor ?? "",
        descricao: af?.descricao ?? "",
        data_inicio: af?.data_inicio?.slice(0, 10) ?? "",
        data_fim: af?.data_fim?.slice(0, 10) ?? "",
        status: af?.status ?? true,
      }}
      fields={[
        {
          name: "numero",
          label: "Número",
          type: "text",
          description: "Formato: nnn/AAAA (ex: 123/2025)",
        },
        { name: "fornecedor", label: "Fornecedor", type: "text" },
        { name: "descricao", label: "Descrição", type: "textarea" },
        { name: "data_inicio", label: "Início", type: "date" },
        { name: "data_fim", label: "Fim", type: "date" },
        { name: "status", label: "Ativo?", type: "switch" },
      ]}
      title={title ?? (isEdit ? "Editar AF" : "Nova AF")}
      triggerLabel={triggerLabel}
      onSubmit={onSubmit ?? (async (values) => {
        if (isEdit) {
          await handleEdit(af.id, values)
        } else {
          await handleCreate(values)
        }
        await mutate(`${API_BASE_URL}/af`)
        })
      }
    />
  )
}
