'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { AFActionCell } from '@/components/af/action-cell'
import { TruncColumnCell } from '@/components/trunc-column-cell'
import { type AF } from '@sgaf/shared'

export const afColumns: ColumnDef<AF>[] = [
  {
    accessorKey: 'numero',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    cell: ({ row }) => <TruncColumnCell text={row.original.descricao ?? ''} />,
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
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row, ...rowProps }) => (
      <AFActionCell af={row.original} {...rowProps} />
    ),
  },
]
