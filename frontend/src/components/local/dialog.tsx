'use client'

import * as React from 'react'
import { localSchema } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/app/handlers'
import { API_BASE_URL } from '@/lib/config'
import { mutate } from 'swr'

interface LocalDialogProps {
  local?: any
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: any) => Promise<void>
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
          await mutate(`${API_BASE_URL}/local`)
        })
      }
    />
  )
}
