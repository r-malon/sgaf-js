'use client'

import * as React from 'react'
import { z } from 'zod'
import { type Item, itemSchema } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/lib/handlers'
import { LocalCombobox } from '@/components/local/combobox'

interface ItemDialogProps {
  item?: Item
  principalId: number
  afNumero?: string
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof itemSchema>) => Promise<void>
}

export function ItemDialog({
  item,
  principalId,
  afNumero,
  triggerLabel = 'Novo Item',
  title,
  onSubmit,
}: ItemDialogProps) {
  const isEdit = !!item
  const { handleCreate, handleEdit } = useEntityHandlers('item')

  return (
    <GenericDialogForm
      schema={itemSchema}
      defaultValues={{
        descricao: item?.descricao ?? '',
        banda_maxima: item?.banda_maxima ?? 1,
        banda_instalada: item?.banda_instalada ?? 0,
        data_instalacao: item?.data_instalacao ?? '',
        quantidade: item?.quantidade ?? 1,
        valor: item?.valor ?? 0,
        status: item?.status ?? true,
        localId: item?.localId,
        principalId: item?.principalId ?? principalId,
      }}
      fields={[
        { name: 'descricao', label: 'Descrição', type: 'textarea' },
        { name: 'valor', type: 'money' },
        { name: 'banda_maxima', label: 'Banda Máxima', type: 'number' },
        { name: 'banda_instalada', label: 'Banda Instalada', type: 'number' },
        { name: 'data_instalacao', label: 'Data de Instalação', type: 'date' },
        { name: 'quantidade', label: 'Quantidade', type: 'number' },
        { name: 'status', label: 'Ativo?', type: 'switch' },
        {
          name: 'localId',
          type: 'custom',
          render: (field) => (
            <LocalCombobox
              value={field.value}
              onChange={(id) => field.onChange(id)}
              readOnly
            />
          ),
        },
      ]}
      title={
        title ?? (isEdit ? 'Editar Item' : `Adicionar Item à AF ${afNumero}`)
      }
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(item.id, values)
          } else {
            await handleCreate({ ...values, principalId })
          }
        })
      }
    />
  )
}
