'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus, Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { ItemActionCell } from '@/components/item/action-cell'
import { DescriptionCell } from '@/components/description-cell'
import { MoneyColumn } from '@/components/money-column'
import { DescricaoColumnCell } from '@/components/descricao-column-cell'
import { type Row } from '@tanstack/react-table'
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
  },
  {
    accessorKey: 'banda_instalada',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Banda Instalada" />
    ),
  },
  {
    accessorKey: 'data_instalacao',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Instalação" />
    ),
    cell: ({ row }) => row.original.data_instalacao,
  },
  {
    accessorKey: 'quantidade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Qtd." />
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (total: number, row: Row<Item>) => total + row.getValue('quantidade'),
          0,
        ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ativo?" />
    ),
    cell: ({ row }) =>
      row.original.status ? <Check color="green" /> : <X color="red" />,
  },
  MoneyColumn<Item>({
    header: 'Total',
    accessor: (row) => row.total,
    includeSumFooter: true,
  }),
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => <ItemActionCell item={row.original} />,
  },
]
