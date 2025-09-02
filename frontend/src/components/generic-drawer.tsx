"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DataTable } from "@/components/data-table"
import { DataTableFilter } from "@/components/data-table-filter"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table"
import useSWR from "swr"
import { toast } from "sonner"
import { handleFetch } from "@/app/handlers"

interface GenericDrawerProps<T> {
  title: string
  trigger: React.ReactNode
  url: string
  columns: ColumnDef<T, any>[]
  createDialog?: React.ReactNode
}

export function GenericDrawer<T>({
  title,
  trigger,
  url,
  columns,
  actionCell,
  createDialog,
}: GenericDrawerProps<T>) {
  const [open, setOpen] = React.useState(false)

  // SWR for fetching + auto revalidate
  const { data, error, isLoading } = useSWR<T[]>(
    open ? url : null, // only fetch when drawer open
    (u) => handleFetch<T[]>(u),
    { refreshInterval: 6000, revalidateOnFocus: true, revalidateOnReconnect: true }
  )

  React.useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4 space-y-4">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          {createDialog}
        </DrawerHeader>

        {isLoading ? (
          <h1>Carregando...</h1>
        ) : (
          <DataTable table={table} />
        )}
      </DrawerContent>
    </Drawer>
  )
}
