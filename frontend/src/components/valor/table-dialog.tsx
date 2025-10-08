'use client'

import * as React from 'react'
import { type Row } from '@tanstack/react-table'
import { GenericTableDialog } from '@/components/generic-table-dialog'
import { valorColumns } from '@/components/valor/columns'
import { type Valor } from '@sgaf/shared'

interface ValorTableDialogProps {
  itemId: number
  afId: number
  triggerLabel?: React.ReactElement | string
}

export function ValorTableDialog({
  itemId,
  afId,
  triggerLabel = 'Histórico',
}: ValorTableDialogProps) {
  const rowClassName = React.useCallback(
    (row: Row<Valor>) =>
      row.original.data_fim === null ? 'bg-green-100' : undefined,
    [],
  )

  return (
    <GenericTableDialog<Valor>
      triggerLabel={triggerLabel}
      title="Histórico"
      contentClassName="sm:max-w-[625px]"
      entity="valor"
      query={{ itemId, afId }}
      columns={valorColumns}
      rowClassName={rowClassName}
    />
  )
}
