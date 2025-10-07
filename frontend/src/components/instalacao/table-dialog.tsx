'use client'

import * as React from 'react'
import { type Row } from '@tanstack/react-table'
import { GenericTableDialog } from '@/components/generic-table-dialog'
import { getInstalacaoColumns } from '@/components/instalacao/columns'
import { type Instalacao } from '@sgaf/shared'

interface InstalacaoTableDialogProps {
  itemId?: number
  localId?: number
  triggerLabel: React.ReactElement | string
  title?: React.ReactElement | string
}

export function InstalacaoTableDialog({
  itemId,
  localId,
  triggerLabel,
  title = 'Instalações',
}: InstalacaoTableDialogProps) {
  const query = React.useMemo(() => {
    const q: { itemId?: number; localId?: number } = {}
    if (itemId) q.itemId = itemId
    if (localId) q.localId = localId
    return q
  }, [itemId, localId])

  const columns = React.useMemo(() => getInstalacaoColumns(query), [query])

  const rowClassName = React.useCallback(
    (row: Row<Instalacao>) => (row.original.status ? undefined : 'opacity-50'),
    [],
  )

  return (
    <GenericTableDialog<Instalacao>
      triggerLabel={triggerLabel}
      title={title}
      contentClassName="sm:max-w-4xl"
      entity="instalacao"
      query={query}
      columns={columns}
      rowClassName={rowClassName}
    />
  )
}
