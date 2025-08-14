"use client"

import { API_BASE_URL } from "@/lib/config"
import { DataTable } from "@/components/data-table"
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
  console.log(data, error, loading)

  if (loading) return <h1>Loading...</h1>
  if (error) return <Error />

  return (
  <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <AFDialogForm />
    <DataTable columns={columns} data={data ?? []} />
  </div>
  );
}
