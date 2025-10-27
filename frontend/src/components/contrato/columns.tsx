'use client'

import { ColumnDef, type Row } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { ContratoActionCell } from '@/components/contrato/action-cell'
import { MoneyColumn } from '@/components/money-column'
import { type Contrato } from '@sgaf/shared'

export const contratoColumns: ColumnDef<Contrato>[] = [
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
    accessorKey: 'cpf',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF/CNPJ" />
    ),
  },
  {
    accessorKey: 'af_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="# AFs" />
    ),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => <ContratoActionCell contrato={row.original} />,
  },
]
