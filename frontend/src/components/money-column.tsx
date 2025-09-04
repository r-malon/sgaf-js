'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table-column-header'

interface MoneyColumnOptions<T> {
  header?: string
  accessor: (row: T) => number | null | undefined
  id?: string
}

export function moneyColumn<T>({
  header = 'Valor',
  accessor,
  id,
}: MoneyColumnOptions<T>): ColumnDef<T> {
  return {
    id: id ?? header,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    accessorFn: accessor,
    cell: ({ getValue }) => {
      const cents = getValue<number>() ?? 0
      return (
        <span className="font-medium tabular-nums">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
          }).format(cents / 100)}
        </span>
      )
    },
  }
}
