'use client'

import { memo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table-column-header'
import { formatBRL } from '@/lib/utils'

interface MoneyColumnProps<T> {
  header?: string
  accessor: (row: T) => number | null | undefined
  id?: string
  includeSumFooter?: boolean
}

const MoneyCell = memo(function MoneyCell({ value }: { value: number }) {
  return (
    <span className="font-medium tabular-nums">{formatBRL(value ?? 0)}</span>
  )
})

export function MoneyColumn<T>({
  header = 'Valor',
  accessor,
  id,
  includeSumFooter = false,
}: MoneyColumnProps<T>): ColumnDef<T> {
  return {
    id: id ?? header,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={header} />
    ),
    accessorFn: accessor,
    cell: ({ getValue }) => <MoneyCell value={getValue<number>() ?? 0} />,
    footer: includeSumFooter
      ? (props) => {
          const sumCents = props.table
            .getFilteredRowModel()
            .rows.reduce((acc, row) => acc + (accessor(row.original) ?? 0), 0)
          return <MoneyCell value={sumCents} />
        }
      : undefined,
  }
}
