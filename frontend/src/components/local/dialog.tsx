'use client'

import * as React from 'react'
import { z } from 'zod'
import { localSchema, type Local } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/app/handlers'

interface LocalDialogProps {
  local?: Local
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof localSchema>) => Promise<void>
}

export function LocalDialog({
  local,
  triggerLabel = 'Novo Local',
  title,
  onSubmit,
}: LocalDialogProps) {
  const isEdit = !!local
  const { handleCreate, handleEdit } = useEntityHandlers('local')

  return (
    <GenericDialogForm
      schema={localSchema}
      defaultValues={{
        nome: local?.nome ?? '',
      }}
      fields={[{ name: 'nome', label: 'Endereço', type: 'text' }]}
      title={title ?? (isEdit ? 'Editar Local' : 'Novo Local')}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(local.id, values)
          } else {
            await handleCreate(values)
          }
        })
      }
    />
  )
}
