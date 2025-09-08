'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { DataTable } from '@/components/data-table'
import { DataTableFilter } from '@/components/data-table-filter'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { useEntityHandlers } from '@/app/handlers'
import { useAPISWR } from '@/lib/hooks'

interface GenericDrawerProps<T> {
  title: string
  trigger: React.ReactNode
  entityName: string
  query?: Record<string, any>
  columns: ColumnDef<T, any>[]
  createDialog?: React.ReactNode
}

export function GenericDrawer<T>({
  title,
  trigger,
  entityName,
  query,
  columns,
  createDialog,
}: GenericDrawerProps<T>) {
  const [open, setOpen] = React.useState(false)

  const { key } = useEntityHandlers(entityName)
  const { data, error, isLoading } = useAPISWR<T>(
    open ? key(query) : null,
  )
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

        {isLoading ? <h1>Carregando...</h1> : <DataTable table={table} />}
      </DrawerContent>
    </Drawer>
  )
}
