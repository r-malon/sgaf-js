'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { MoneyColumn } from '@/components/money-column'
import { Valor } from '@sgaf/shared'

export const valorColumns: ColumnDef<Valor>[] = [
  MoneyColumn<Valor>({
    header: 'Valor',
    accessor: (row) => row.original.valor,
  }),
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
]
