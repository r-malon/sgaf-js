"use client"

import { API_BASE_URL } from "@/lib/config"
import { DataTable } from "@/components/data-table"
import { DataTableFilter } from "@/components/data-table-filter"
import { AFDialog } from "@/components/af-dialog"
import useSWR from "swr"
import { AF } from "@sgaf/shared"
import { APIResponse } from "./types"
import { afColumns } from "./columns"
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })

export default function Home() {
  const { data, error, isLoading } = useSWR<APIResponse<AF>>(`${API_BASE_URL}/af`, fetcher, {
    refreshInterval: 6000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message ?? "Não foi possível obter os dados.")
    }
  }, [error])

  const [sorting, setSorting] = useState<SortingState>([])
  const afTable = useReactTable({
    data: data?.data ?? [],
    columns: afColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  if (isLoading) return <h1>Loading...</h1>

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <DataTableFilter table={afTable} columnId="fornecedor" placeholder="Buscar fornecedor" />
        <DataTableFilter table={afTable} columnId="numero" placeholder="Buscar número" />
        <AFDialog />
      </div>

      <DataTable table={afTable} /> {/*columns={afColumns} data={data?.data ?? []} />*/}
    </div>
  );
}
