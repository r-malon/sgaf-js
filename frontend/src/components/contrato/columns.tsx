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
    accessorKey: 'nome',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'endereco',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endereço" />
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
      <DataTableColumnHeader column={column} title="Qtd." />
    ),
    footer: ({ table }) =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (total: number, row: Row<Contrato>) =>
            total + (row.getValue('af_count') as number),
          0,
        ),
  },
  MoneyColumn<Contrato>({
    header: 'Total',
    accessor: (row) => row.total,
    includeSumFooter: true,
  }),
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => <ContratoActionCell contrato={row.original} />,
  },
]
