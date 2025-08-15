"use client"

import { API_BASE_URL } from "@/lib/config"
import { DataTable } from "@/components/data-table"
import { DataTableFilter } from "@/components/data-table-filter"
import { AFDialogForm } from "@/components/af-dialog-form"
import useSWR, { mutate } from "swr"
import { columns, AF } from "./columns"
import { handleDelete, handleEdit } from "./handlers"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })

export default function Home() {
  const { data, error, loading } = useSWR<AF[]>(`${API_BASE_URL}/af`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  if (loading) return <h1>Loading...</h1>
  if (error) return <Error />

  return (
  <>
    <AFDialogForm />
    <div className="flex gap-4 py-4">
      <DataTableFilter table={table} columnId="fornecedor" placeholder="Fornecedor" />
      <DataTableFilter table={table} columnId="numero" placeholder="Número" />
    </div>
    <DataTable columns={columns} data={data?.data ?? []} />
  </>
  );
}
