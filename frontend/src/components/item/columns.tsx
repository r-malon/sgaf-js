'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { ItemActionCell } from '@/components/item/action-cell'
import { TruncColumnCell } from '@/components/trunc-column-cell'
import { type Item } from '@sgaf/shared'

export const itemColumns: ColumnDef<Item>[] = [
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => <TruncColumnCell text={row.original.descricao ?? ''} />,
  },
  {
    accessorKey: 'banda_maxima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banda Max." />
    ),
    cell: ({ row }) =>
      row.original.banda_maxima > 0 ? (
        row.original.banda_maxima
      ) : (
        <Minus color="lightgray" />
      ),
  },
  {
    accessorKey: 'quantidade_usada',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd." />
    ),
  },
  {
    accessorKey: 'quantidade_maxima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Max." />
    ),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, ...rowProps }) => (
      <ItemActionCell item={row.original} {...rowProps} />
    ),
  },
]
