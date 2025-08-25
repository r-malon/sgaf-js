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
import { ColumnDef } from "@tanstack/react-table"

interface GenericDrawerProps<T> {
  title: string
  trigger: React.ReactNode
  fetchEntities: () => Promise<T[]>
  columns: ColumnDef<T, any>[]
  actionCell: (entity: T) => React.ReactNode
  createDialog: React.ReactNode
}

export function GenericDrawer<T>({
  title,
  trigger,
  fetchEntities,
  columns,
  actionCell,
  createDialog,
}: GenericDrawerProps<T>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          {createDialog}
        </DrawerHeader>
        <div className="py-4">
          <DataTable
            fetchData={fetchEntities}
            columns={[
              ...columns,
              {
                id: "actions",
                cell: ({ row }) => actionCell(row.original),
              },
            ]}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
