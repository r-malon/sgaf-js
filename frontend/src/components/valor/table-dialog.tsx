'use client'

import * as React from 'react'
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { valorColumns } from '@/components/valor/columns'
import { Valor } from '@sgaf/shared'
import { useEntityHandlers } from '@/app/handlers'
import useSWR from 'swr'

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
  const { baseURL, handleFetch } = useEntityHandlers('valor')

  // SWR for fetching + auto revalidate
  const { data, error, isLoading } = useSWR<Valor[]>(
    open ? `${baseURL}?Item_id=${itemId}` : null, // only fetch when drawer open
    (u) => handleFetch<Valor[]>(u),
    {
      refreshInterval: 6000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )
  console.log(data)
  console.log(error)
  console.log(isLoading)

  React.useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  const table = useReactTable({
    data: data ?? [],
    columns: valorColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <Dialog>
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
