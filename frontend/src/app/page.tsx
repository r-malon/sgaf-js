"use client"

import { API_BASE_URL } from "@/lib/config"
import { DataTable } from "@/components/data-table"
import { DataTableFilter } from "@/components/data-table-filter"
import { AFDialog } from "@/components/af/dialog"
import { LocalDialog } from "@/components/local/dialog"
import { LocalCombobox } from "@/components/local/combobox"
import { AF } from "@sgaf/shared"
import { afColumns } from "@/components/af/columns"
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table"
import useSWR from "swr"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { handleFetch } from "@/app/handlers"

export default function Home() {
  const { data, error, isLoading } = useSWR<AF[]>(
    `${API_BASE_URL}/af`,
    (url) => handleFetch<AF[]>(url),
    {
      refreshInterval: 6000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const [sorting, setSorting] = useState<SortingState>([])
  const afTable = useReactTable({
    data: data ?? [],
    columns: afColumns,
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
        <DataTableFilter table={afTable} columnId="fornecedor" placeholder="Buscar fornecedor" />
        <DataTableFilter table={afTable} columnId="numero" placeholder="Buscar número" />
        <AFDialog />
      </div>

      <DataTable table={afTable} />
    </div>
  )
}
