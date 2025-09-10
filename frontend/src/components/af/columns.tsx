'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus, Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { AFActionCell } from '@/components/af/action-cell'
import { DescriptionCell } from '@/components/description-cell'
import { MoneyColumn } from '@/components/money-column'
import { DescricaoColumnCell } from '@/components/descricao-column-cell'
import { AF } from '@sgaf/shared'

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
    cell: ({ row }) => row.original.data_inicio.slice(0, 10),
  },
  {
    accessorKey: 'data_fim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim" />
    ),
    cell: ({ row }) => row.original.data_fim.slice(0, 10),
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
    cell: ({ row }) => <AFActionCell af={row.original} />,
  },
]
