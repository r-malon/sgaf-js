'use client'

import * as React from 'react'
import { flexRender, Row, Table as ReactTable } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  table: ReactTable<TData>
  rowClassName?: (row: Row<TData>) => string | undefined
  rowProps?: Record<string, any>
}

const MemoizedTableRow = React.memo(function MemoizedTableRow<TData>({
  row,
  className,
  rowProps,
}: {
  row: Row<TData>
  className?: string
  rowProps?: Record<string, any>
}) {
  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      className={cn(className)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="text-center">
          {cell.column.id === 'actions' && cell.column.columnDef.cell
            ? flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                ...rowProps,
              })
            : flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
})

export function DataTable<TData, TValue>({
  table,
  rowClassName,
  rowProps,
}: DataTableProps<TData, TValue>) {
  const columns = table.getAllLeafColumns()
  const hasFooter = columns.some((column) => !!column.columnDef.footer)

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-center">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <MemoizedTableRow
                  key={row.id}
                  row={row}
                  className={rowClassName?.(row)}
                  rowProps={rowProps}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {hasFooter && (
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        )}
      </Table>
    </div>
  )
}
