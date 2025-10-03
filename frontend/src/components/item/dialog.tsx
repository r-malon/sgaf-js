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
        banda_maxima: item?.banda_maxima ?? 0,
        quantidade_maxima: item?.quantidade_maxima ?? 1,
        data_alteracao: item?.data_alteracao ?? null,
        valor: 0,
        principalId: item?.principalId ?? principalId,
      }}
      fields={[
        { name: 'descricao', label: 'Descrição', type: 'textarea' },
        { name: 'valor', label: 'Valor mensal', type: 'money' },
        {
          name: 'data_alteracao',
          label: 'Alteração',
          type: 'date',
          show: isEdit,
        },
        {
          name: 'banda_maxima',
          label: (
            <>
              Banda Máxima
              <span className="text-sm text-muted-foreground">
                (ignore caso serviço)
              </span>
            </>
          ),
          type: 'number',
          show: !isEdit || item?.banda_maxima > 1,
        },
        {
          name: 'quantidade_maxima',
          label: 'Quantidade máxima',
          type: 'number',
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
