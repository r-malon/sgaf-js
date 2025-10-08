'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus, Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { InstalacaoActionCell } from '@/components/instalacao/action-cell'
import { type Instalacao } from '@sgaf/shared'

export function getInstalacaoColumns(query?: {
  itemId?: number
  localId?: number
}): ColumnDef<Instalacao>[] {
  const showItem = !query?.itemId
  const showLocal = !query?.localId

  const columns: ColumnDef<Instalacao>[] = [
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
      cell: ({ row }) =>
        row.original.data_desinstalacao ?? <Minus color="lightgray" />,
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
      cell: ({ row }) => <InstalacaoActionCell instalacao={row.original} />,
    },
  ]

  if (showItem)
    columns.unshift({
      accessorKey: 'item.descricao',
      header: 'Item',
      cell: ({ row }) =>
        row.original.item?.descricao ?? `Item ${row.original.itemId}`,
    })

  if (showLocal)
    columns.unshift({
      accessorKey: 'local.nome',
      header: 'Local',
      cell: ({ row }) => row.original.local?.nome ?? '',
    })

  return columns
}
