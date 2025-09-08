'use client'

import * as React from 'react'
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { valorColumns } from '@/components/valor/columns'
import { Valor } from '@sgaf/shared'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'

interface ValorTableDialogProps {
  itemId: number
  triggerLabel?: string
}

export function ValorTableDialog({
  itemId,
  triggerLabel,
}: ValorTableDialogProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [open, setOpen] = React.useState(false)

  const { key } = useEntityHandlers('valor')
  const { data, error, isLoading } = useAPISWR<Valor>(
    open ? key({ Item_id: itemId }) : null,
  )

  const table = useReactTable({
    data: data ?? [],
    columns: valorColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Histórico</DialogTitle>
        </DialogHeader>

        <DataTable
          table={table}
          rowClassName={(row) =>
            row.original.data_fim === null ? 'bg-green-100' : undefined
          }
        />
      </DialogContent>
    </Dialog>
  )
}
