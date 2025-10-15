'use client'

import * as React from 'react'
import { Pencil } from 'lucide-react'
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
  triggerLabel = <Pencil />,
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
        data_desinstalacao: instalacao.data_desinstalacao ?? null,
        quantidade: instalacao.quantidade,
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
      ]}
      title={title ?? 'Editar item instalado'}
      triggerLabel={triggerLabel}
      onSubmit={
        onSubmit ?? (async (values) => await handleEdit(instalacao.id, values))
      }
    />
  )
}
