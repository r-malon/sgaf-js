'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Minus } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { MoneyColumn } from '@/components/money-column'
import { type Valor } from '@sgaf/shared'

export const valorColumns: ColumnDef<Valor>[] = [
  MoneyColumn<Valor>({
    header: 'Valor',
    accessor: (row) => row.valor,
  }),
  {
    accessorKey: 'data_inicio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Início" />
    ),
    cell: ({ row }) => row.original.data_inicio,
  },
  {
    accessorKey: 'data_fim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fim" />
    ),
    cell: ({ row }) => row.original.data_fim ?? <Minus color="lightgray" />,
  },
]
