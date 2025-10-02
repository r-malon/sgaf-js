'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { ItemLocalActionCell } from '@/components/item-local/action-cell'
import { type ItemLocal } from '@sgaf/shared'

export function getItemLocalColumns(query?: {
  itemId?: number
  localId?: number
}): ColumnDef<ItemLocal>[] {
  const showItem = !query?.itemId
  const showLocal = !query?.localId

  const columns: ColumnDef<ItemLocal>[] = []

  if (showItem) {
    columns.push({
      accessorKey: 'item.descricao',
      header: 'Item',
      cell: ({ row }) =>
        row.original.item?.descricao ?? `Item ${row.original.itemId}`,
    })
  }

  if (showLocal) {
    columns.push({
      accessorKey: 'local.nome',
      header: 'Local',
      cell: ({ row }) => row.original.local?.nome ?? '',
    })
  }

  columns.push(
    {
      accessorKey: 'banda_instalada',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Banda" />
      ),
    },
    {
      accessorKey: 'quantidade',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qtd." />
      ),
    },
    {
      accessorKey: 'data_instalacao',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instalação" />
      ),
    },
    {
      accessorKey: 'data_desinstalacao',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Desinstalação" />
      ),
      cell: ({ row }) => row.original.data_desinstalacao ?? '-',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) =>
        row.original.status ? <Check color="green" /> : <X color="red" />,
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => <ItemLocalActionCell itemLocal={row.original} />,
    },
  )

  return columns
}
