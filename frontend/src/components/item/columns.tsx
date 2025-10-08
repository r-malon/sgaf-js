'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { ItemActionCell } from '@/components/item/action-cell'
import { MoneyColumn } from '@/components/money-column'
import { DescricaoColumnCell } from '@/components/descricao-column-cell'
import { type Item } from '@sgaf/shared'

export const itemColumns: ColumnDef<Item>[] = [
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => (
      <DescricaoColumnCell descricao={row.original.descricao ?? ''} />
    ),
  },
  {
    accessorKey: 'banda_maxima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banda Máxima" />
    ),
    cell: ({ row }) =>
      row.original.banda_maxima > 0 ? (
        row.original.banda_maxima
      ) : (
        <Minus color="lightgray" />
      ),
  },
  {
    accessorKey: 'data_alteracao',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alteração" />
    ),
    cell: ({ row }) =>
      row.original.data_alteracao ?? <Minus color="lightgray" />,
  },
  {
    accessorKey: 'quantidade_maxima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd. Max." />
    ),
  },
  MoneyColumn<Item>({
    header: 'Total',
    accessor: (row) => row.total,
    includeSumFooter: true,
  }),
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, ...rowProps }) => (
      <ItemActionCell item={row.original} {...rowProps} />
    ),
  },
]
