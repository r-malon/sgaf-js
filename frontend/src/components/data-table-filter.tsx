"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"

interface DataTableFilterProps<TData> {
  table: Table<TData>
  columnId: string
  placeholder?: string
}

export function DataTableFilter<TData>({
  table,
  columnId,
  placeholder = "Filtrar...",
}: DataTableFilterProps<TData>) {
  const column = table.getColumn(columnId)

  if (!column) return null

  return (
    <Input
      placeholder={placeholder}
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(event) => column.setFilterValue(event.target.value)}
      className="max-w-sm"
    />
  )
}
