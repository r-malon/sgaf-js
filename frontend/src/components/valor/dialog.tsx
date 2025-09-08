'use client'

import * as React from 'react'
import { z } from 'zod'
import { valorSchema } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/app/handlers'

interface ValorDialogProps {
  valor?: z.infer<typeof valorSchema>
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof valorSchema>) => Promise<void>
}

export function ValorDialog({
  valor,
  triggerLabel = 'Novo Valor',
  title,
  onSubmit,
}: ValorDialogProps) {
  const isEdit = !!valor
  const { handleCreate, handleEdit } = useEntityHandlers('valor')

  return (
    <GenericDialogForm
      schema={valorSchema}
      defaultValues={{
        Item_id: valor?.Item_id ?? 0,
        valor: valor?.valor ?? 0,
        data_inicio: valor?.data_inicio?.slice(0, 10) ?? '',
        data_fim: valor?.data_fim?.slice(0, 10) ?? '',
      }}
      fields={[
        { name: 'valor', type: 'money' },
        { name: 'data_inicio', label: 'Início', type: 'date' },
        { name: 'data_fim', label: 'Fim', type: 'date' },
      ]}
      title={title ?? (isEdit ? 'Editar Valor' : 'Novo Valor')}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(valor.id, values)
          } else {
            await handleCreate(values)
          }
        })
      }
    />
  )
}
