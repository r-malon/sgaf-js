'use client'

import * as React from 'react'
import { z } from 'zod'
import { useEntityHandlers } from '@/lib/handlers'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { type ItemLocal, itemLocalSchema } from '@sgaf/shared'

interface ItemLocalDialogProps {
  itemLocal: ItemLocal
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof itemLocalSchema>) => Promise<void>
}

export function ItemLocalDialog({
  itemLocal,
  triggerLabel = 'Editar',
  title,
  onSubmit,
}: ItemLocalDialogProps) {
  const { handleEdit } = useEntityHandlers('item-local')

  return (
    <GenericDialogForm
      schema={itemLocalSchema}
      defaultValues={{
        itemId: itemLocal.itemId,
        localId: itemLocal.localId,
        banda_instalada: itemLocal.banda_instalada,
        data_instalacao: itemLocal.data_instalacao,
        data_desinstalacao: itemLocal.data_desinstalacao ?? '',
        quantidade: itemLocal.quantidade,
        status: itemLocal.status,
      }}
      fields={[
        {
          name: 'banda_instalada',
          label: 'Banda instalada',
          type: 'number',
        },
        { name: 'data_instalacao', label: 'Instalação', type: 'date' },
        { name: 'data_desinstalacao', label: 'Desinstalação', type: 'date' },
        { name: 'quantidade', label: 'Quantidade', type: 'number' },
        { name: 'status', label: 'Ativo?', type: 'switch' },
      ]}
      title={title ?? 'Editar item instalado'}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ?? (async (values) => await handleEdit(itemLocal.id, values))
      }
    />
  )
}
