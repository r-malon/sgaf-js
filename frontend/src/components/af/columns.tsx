'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { AFActionCell } from '@/components/af/action-cell'
import { MoneyColumn } from '@/components/money-column'
import { DescricaoColumnCell } from '@/components/descricao-column-cell'
import { type AF } from '@sgaf/shared'

export const afColumns: ColumnDef<AF>[] = [
  {
    accessorKey: 'numero',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
  },
  {
    accessorKey: 'fornecedor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => (
      <DescricaoColumnCell descricao={row.original.descricao ?? ''} />
    ),
  },
  {
    accessorKey: 'data_inicio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Início" />
    ),
  },
  {
    accessorKey: 'data_fim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ativa?" />
    ),
    cell: ({ row }) =>
      row.original.status ? <Check color="green" /> : <X color="red" />,
  },
  MoneyColumn<AF>({
    header: 'Total',
    accessor: (row) => row.total,
    includeSumFooter: true,
  }),
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, ...rowProps }) => (
      <AFActionCell af={row.original} {...rowProps} />
    ),
  },
]
