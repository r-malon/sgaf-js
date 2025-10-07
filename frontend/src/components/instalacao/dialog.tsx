'use client'

import * as React from 'react'
import { z } from 'zod'
import { useEntityHandlers } from '@/lib/handlers'
import { GenericDialogForm } from '@/components/generic-dialog-form'
import { type Instalacao, instalacaoSchema } from '@sgaf/shared'

interface InstalacaoDialogProps {
  instalacao: Instalacao
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof instalacaoSchema>) => Promise<void>
}

export function InstalacaoDialog({
  instalacao,
  triggerLabel = 'Editar',
  title,
  onSubmit,
}: InstalacaoDialogProps) {
  const { handleEdit } = useEntityHandlers('instalacao')

  return (
    <GenericDialogForm
      schema={instalacaoSchema}
      defaultValues={{
        itemId: instalacao.itemId,
        localId: instalacao.localId,
        banda_instalada: instalacao.banda_instalada,
        data_instalacao: instalacao.data_instalacao,
        data_desinstalacao: instalacao.data_desinstalacao ?? '',
        quantidade: instalacao.quantidade,
        status: instalacao.status,
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
        onSubmit ?? (async (values) => await handleEdit(instalacao.id, values))
      }
    />
  )
}
