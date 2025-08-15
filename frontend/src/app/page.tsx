"use client"

import { API_BASE_URL } from "@/lib/config"
import { DataTable } from "@/components/data-table"
import { DataTableFilter } from "@/components/data-table-filter"
import { AFDialog } from "@/components/af-dialog"
import useSWR, { mutate } from "swr"
import { AF, APIResponse } from "./types"
import { columns } from "./columns"
import { handleDelete, handleEdit } from "./handlers"
import { useReactTable, getCoreRowModel, getFilteredRowModel } from "@tanstack/react-table"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })

export default function Home() {
  const { data, error, isLoading } = useSWR<AF[]>(`${API_BASE_URL}/af`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  const afTable = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) return <h1>Loading...</h1>
  if (error) return <Error />

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4 items-center">
        <DataTableFilter table={afTable} tableId="fornecedor" placeholder="Buscar fornecedor" />
        <DataTableFilter table={afTable} tableId="numero" placeholder="Buscar número" />
        <AFDialog />
      </div>

      <DataTable table={afTable} columns={columns} data={data?.data ?? []} />
    </div>
  );
}
