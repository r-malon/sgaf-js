'use client'

import * as React from 'react'
import { z } from 'zod'
import { type AF, afSchema } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/lib/handlers'

interface AFDialogProps {
  af?: AF
  contratoId: number
  contratoNumero?: string
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof afSchema>) => Promise<void>
}

export function AFDialog({
  af,
  contratoId,
  contratoNumero,
  triggerLabel = 'Nova AF',
  title,
  onSubmit,
}: AFDialogProps) {
  const isEdit = !!af
  const { handleCreate, handleEdit } = useEntityHandlers('af')

  return (
    <GenericDialogForm
      schema={afSchema}
      defaultValues={{
        numero: af?.numero ?? '',
        fornecedor: af?.fornecedor ?? '',
        descricao: af?.descricao ?? '',
        data_inicio: af?.data_inicio ?? '',
        data_fim: af?.data_fim ?? '',
        status: af?.status ?? true,
        contratoId: af?.contratoId ?? contratoId,
      }}
      fields={[
        {
          name: 'numero',
          label: 'Número',
          type: 'text',
          description: 'Formato: número/ano (ex: 123/2025)',
        },
        { name: 'fornecedor', label: 'Fornecedor', type: 'text' },
        { name: 'descricao', label: 'Descrição', type: 'textarea' },
        { name: 'data_inicio', label: 'Início', type: 'date' },
        { name: 'data_fim', label: 'Fim', type: 'date' },
        { name: 'status', label: 'Ativo?', type: 'switch' },
      ]}
      title={title ?? (isEdit ? 'Editar AF' : 'Nova AF')}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(af.id, values)
          } else {
            await handleCreate({ ...values, contratoId })
          }
        })
      }
    />
  )
}
