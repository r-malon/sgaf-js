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
  type Row,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'

interface GenericDrawerProps<T> {
  title?: React.ReactElement | string
  trigger: React.ReactNode
  entity: string
  query?: Record<string, any>
  columns: ColumnDef<T, any>[]
  rowClassName?: (row: Row<T>) => string | undefined
  rowProps?: Record<string, any>
  createDialog?: React.ReactNode
  meta?: Record<string, unknown>
}

export function GenericDrawer<T>({
  title,
  trigger,
  entity,
  query,
  columns,
  rowClassName,
  rowProps,
  createDialog,
  meta,
}: GenericDrawerProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { key } = useEntityHandlers(entity)
  const { data, error, isLoading } = useAPISWR<T>(open ? key(query) : null, {
    keepPreviousData: true,
  })

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
    meta,
  })

  React.useEffect(() => {
    return () => {
      table.reset()
      setSorting([])
    }
  }, [table])

  if (error) return <div>Error: {error.message}</div>

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>{title ?? ''}</DrawerTitle>
          {createDialog}
        </DrawerHeader>

        {isLoading ? (
          <h1>Carregando...</h1>
        ) : (
          <DataTable
            table={table}
            rowClassName={rowClassName}
            rowProps={rowProps}
          />
        )}
      </DrawerContent>
    </Drawer>
  )
}
