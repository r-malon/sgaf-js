"use client"

import { z } from "zod"
import { itemSchema } from "@sgaf/shared"
import { GenericDialogForm } from "@/components/generic-dialog-form"
import { LocalCombobox } from "@/components/local-combobox"

interface ItemDialogProps {
  item?: z.infer<typeof itemSchema>
  triggerLabel: React.ReactNode
  title: string
  onSubmit: (values: z.infer<typeof itemSchema>) => Promise<void>
}

export function ItemDialog({ item, triggerLabel, title, onSubmit }: ItemDialogProps) {
  return (
    <GenericDialogForm
      schema={itemSchema}
      defaultValues={item}
      onSubmit={onSubmit}
      triggerLabel={triggerLabel}
      title={title}
      fields={[
        { name: "descricao", label: "Descrição", type: "text" },
        { name: "banda_maxima", label: "Banda Máxima", type: "number" },
        { name: "banda_instalada", label: "Banda Instalada", type: "number" },
        { name: "data_instalacao", label: "Data de Instalação", type: "date" },
        { name: "quantidade", label: "Quantidade", type: "number" },
        { name: "status", label: "Ativo?", type: "switch" },
        {
          name: "Local_id",
          label: "Local",
          type: "custom",
          render: ({ field }) => (
            <LocalCombobox
              value={field.value}
              onChange={(val) => field.onChange(val)}
            />
          ),
        },
      ]}
    />
  )
}
