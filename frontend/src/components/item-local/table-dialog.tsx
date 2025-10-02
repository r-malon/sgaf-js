'use client'

import * as React from 'react'
import { type Row } from '@tanstack/react-table'
import { GenericTableDialog } from '@/components/generic-table-dialog'
import { getItemLocalColumns } from '@/components/item-local/columns'
import { type ItemLocal } from '@sgaf/shared'

interface ItemLocalTableDialogProps {
  itemId?: number
  localId?: number
  triggerLabel: React.ReactElement | string
  title?: React.ReactElement | string
}

export function ItemLocalTableDialog({
  itemId,
  localId,
  triggerLabel,
  title = 'Instalações',
}: ItemLocalTableDialogProps) {
  const query = React.useMemo(() => {
    const q: { itemId?: number; localId?: number } = {}
    if (itemId) q.itemId = itemId
    if (localId) q.localId = localId
    return q
  }, [itemId, localId])

  const columns = React.useMemo(() => getItemLocalColumns(query), [query])

  const rowClassName = React.useCallback(
    (row: Row<ItemLocal>) => (row.original.status ? undefined : 'opacity-50'),
    [],
  )

  return (
    <GenericTableDialog<ItemLocal>
      triggerLabel={triggerLabel}
      title={title}
      contentClassName="sm:max-w-4xl"
      entity="item-local"
      query={query}
      columns={columns}
      rowClassName={rowClassName}
    />
  )
}
