'use client'

import * as React from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'
import { BaseDialog } from '@/components/base-dialog'

interface GenericTableDialogProps<T> {
  triggerLabel: React.ReactElement | string
  title: React.ReactElement | string
  contentClassName?: string
  entity: string
  query?: Record<string, any>
  columns: ColumnDef<T, any>[]
  rowClassName?: (row: Row<T>) => string | undefined
}

export function GenericTableDialog<T>({
  triggerLabel,
  title,
  contentClassName,
  entity,
  query,
  columns,
  rowClassName,
}: GenericTableDialogProps<T>) {
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

  return (
    <BaseDialog
      triggerLabel={triggerLabel}
      title={title}
      contentClassName={contentClassName}
      onOpenChange={setOpen}
    >
      {error ? (
        <div>Error: {error.message}</div>
      ) : isLoading ? (
        <h1>Carregando...</h1>
      ) : (
        <DataTable table={table} rowClassName={rowClassName} />
      )}
    </BaseDialog>
  )
}
