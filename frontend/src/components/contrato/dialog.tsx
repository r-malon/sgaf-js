'use client'

import * as React from 'react'
import { z } from 'zod'
import { type Contrato, contratoSchema } from '@sgaf/shared'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { useEntityHandlers } from '@/lib/handlers'

interface ContratoDialogProps {
  contrato?: Contrato
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof contratoSchema>) => Promise<void>
}

export function ContratoDialog({
  contrato,
  triggerLabel = 'Novo Contrato',
  title,
  onSubmit,
}: ContratoDialogProps) {
  const isEdit = !!contrato
  const { handleCreate, handleEdit } = useEntityHandlers('contrato')

  return (
    <GenericDialogForm
      schema={contratoSchema}
      defaultValues={{
        numero: contrato?.numero ?? '',
        nome: contrato?.nome ?? '',
        endereco: contrato?.endereco ?? '',
        cpf: contrato?.cpf ?? '',
      }}
      fields={[
        {
          name: 'numero',
          label: 'Número',
          type: 'text',
          description: 'Formato: nnn/AAAA (ex: 123/2025)',
        },
        { name: 'nome', label: 'Nome', type: 'text' },
        { name: 'endereco', label: 'Endereço', type: 'text' },
        { name: 'cpf', label: 'CPF/CNPJ', type: 'text' },
      ]}
      title={title ?? (isEdit ? 'Editar Contrato' : 'Novo Contrato')}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ??
        (async (values) => {
          if (isEdit) {
            await handleEdit(contrato.id, values)
          } else {
            await handleCreate(values)
          }
        })
      }
    />
  )
}
