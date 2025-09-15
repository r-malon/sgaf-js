'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from '@/components/data-table'
import { DataTableFilter } from '@/components/data-table-filter'
import { ContratoDialog } from '@/components/contrato/dialog'
import { AFDialog } from '@/components/af/dialog'
import { contratoColumns } from '@/components/contrato/columns'
import { afColumns } from '@/components/af/columns'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'
import { Contrato, AF } from '@sgaf/shared'

export default function Home() {
  const [activeTab, setActiveTab] = useState('contrato')
  const [sortingContrato, setSortingContrato] = useState<SortingState>([])
  const [sortingAF, setSortingAF] = useState<SortingState>([])

  const { key: contratoKey } = useEntityHandlers('contrato')
  const { key: afKey } = useEntityHandlers('af')

  const { data: contratoData, error: contratoError } = useAPISWR<Contrato>(
    activeTab === 'contrato' ? contratoKey() : null,
    { dedupingInterval: 6000, keepPreviousData: true }
  )
  const { data: afData, error: afError } = useAPISWR<AF>(
    activeTab === 'af' ? afKey() : null,
    { dedupingInterval: 6000, keepPreviousData: true }
  )

  const contratoTable = useReactTable({
    data: contratoData ?? [],
    columns: contratoColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting: sortingContrato },
    onSortingChange: setSortingContrato,
  })

  const afTable = useReactTable({
    data: afData ?? [],
    columns: afColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting: sortingAF },
    onSortingChange: setSortingAF,
  })

  const principalRowClassName = useCallback(
    (row) => (row.original.data_fim === null ? 'bg-green-100' : undefined),
    [],
  )

  useEffect(() => {
    return () => {
      contratoTable.reset()
      afTable.reset()
      setSortingContrato([])
      setSortingAF([])
    }
  }, [contratoTable, afTable])

  if (contratoError || afError) return <div>Error: {(contratoError || afError)?.message}</div>

  return (
    <main className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contrato">Contratos</TabsTrigger>
          <TabsTrigger value="af">AFs</TabsTrigger>
        </TabsList>
        <TabsContent value="contrato">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DataTableFilter
                table={contratoTable}
                columnId="numero"
                placeholder="Buscar número"
              />
              <ContratoDialog />
            </div>
            <DataTable table={contratoTable} />
          </div>
        </TabsContent>
        <TabsContent value="af">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <DataTableFilter
                table={afTable}
                columnId="fornecedor"
                placeholder="Buscar fornecedor"
              />
              <DataTableFilter
                table={afTable}
                columnId="numero"
                placeholder="Buscar número"
              />
              <AFDialog />
            </div>
            <DataTable table={afTable} rowClassName={principalRowClassName} />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
