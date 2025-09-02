"use client"

import * as React from "react"
import { z } from "zod"
import { itemSchema } from "@sgaf/shared"
import { GenericDialogForm } from "@/components/generic-dialog-form"
import { useEntityHandlers } from "@/app/handlers"
import { API_BASE_URL } from "@/lib/config"
import { mutate } from "swr"
import { LocalCombobox } from "@/components/local/combobox"

interface ItemDialogProps {
  item?: z.infer<typeof itemSchema>
  afId: number
  afNumero?: string
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof itemSchema>) => Promise<void>
}

export function ItemDialog({
  item,
  afId,
  afNumero,
  triggerLabel = "Novo Item",
  title,
  onSubmit,
}: ItemDialogProps) {
  const isEdit = !!item
  const { handleCreate, handleEdit } = useEntityHandlers("item")

  return (
    <GenericDialogForm
      schema={itemSchema}
      defaultValues={{
        descricao: item?.descricao ?? "",
        banda_maxima: item?.banda_maxima ?? 1,
        banda_instalada: item?.banda_instalada ?? 0,
        data_instalacao: item?.data_instalacao?.slice(0, 10) ?? "",
        quantidade: item?.quantidade ?? 1,
        status: item?.status ?? true,
        Local_id: item?.Local_id ?? undefined,
        AF_id: item?.AF_id ?? afId,
      }}
      fields={[
        { name: "descricao", label: "Descrição", type: "textarea" },
        { name: "banda_maxima", label: "Banda Máxima", type: "number" },
        { name: "banda_instalada", label: "Banda Instalada", type: "number" },
        { name: "data_instalacao", label: "Data de Instalação", type: "date" },
        { name: "quantidade", label: "Quantidade", type: "number" },
        { name: "status", label: "Ativo?", type: "switch" },
        {
          name: "Local_id",
          type: "custom",
          render: (field) => (
            <LocalCombobox
              value={field.value}
              onChange={(id) => field.onChange(id)}
              readOnly
            />
          ),
        },
      ]}
      title={title ?? (isEdit ? "Editar Item" : `Adicionar Item à AF ${afNumero}`)}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(item.id, values)
          } else {
            await handleCreate({ ...values, AF_id: afId })
          }
          await mutate(`${API_BASE_URL}/item?AF_id=${afId}`)
        })
      }
    />
  )
}
