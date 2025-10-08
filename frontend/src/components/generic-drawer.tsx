'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
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
  triggerLabel: React.ReactElement | string
  entity: string
  query?: Record<string, any>
  columns: ColumnDef<T, any>[]
  rowClassName?: (row: Row<T>) => string | undefined
  rowProps?: Record<string, any>
  createDialog?: React.ReactNode
}

export function GenericDrawer<T>({
  title,
  triggerLabel,
  entity,
  query,
  columns,
  rowClassName,
  rowProps,
  createDialog,
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
      <DrawerTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DrawerTrigger>
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
