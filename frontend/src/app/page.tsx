'use client'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { DataTableFilter } from '@/components/data-table-filter'
import { LocalDialog } from '@/components/local/dialog'
import { LocalCombobox } from '@/components/local/combobox'
import { ContratoDialog } from '@/components/contrato/dialog'
import { contratoColumns } from '@/components/contrato/columns'
import { useAPISWR } from '@/lib/hooks'
import { useEntityHandlers } from '@/lib/handlers'
import { type Contrato } from '@sgaf/shared'

export default function Home() {
  const { key } = useEntityHandlers('contrato')
  const { data, error, isLoading } = useAPISWR<Contrato>(key())

  const [sorting, setSorting] = useState<SortingState>([])
  const contratoTable = useReactTable({
    data: data ?? [],
    columns: contratoColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  if (isLoading) return <h1>Carregando...</h1>

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <LocalDialog />
        <LocalCombobox />
      </div>

      <div className="flex gap-4 items-center">
        <DataTableFilter
          table={contratoTable}
          columnId="numero"
          placeholder="Buscar número"
        />
        <ContratoDialog />
      </div>

      <DataTable table={contratoTable} />
    </div>
  )
}
