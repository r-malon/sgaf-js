"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Check, X, Plus, Trash2, Pencil } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { useEntityHandlers } from "./handlers"
import { AFActionCell } from "@/components/af-action-cell"
import { AFDialog } from "@/components/af-dialog"
import { AF } from "@sgaf/shared"

export const afColumns: ColumnDef<AF>[] = [
  {
    accessorKey: "numero",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Número" />,
  },
  {
    accessorKey: "fornecedor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fornecedor" />,
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "data_inicio",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Início" />,
    cell: ({ row }) => row.original.data_inicio.slice(0, 10),
  },
  {
    accessorKey: "data_fim",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fim" />,
    cell: ({ row }) => row.original.data_fim.slice(0, 10),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ativa?" />,
    cell: ({ row }) => (row.original.status ? <Check strokeWidth={4} color="green" /> : <X strokeWidth={4} color="red" />),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <AFActionCell af={row.original} />,
  },
]
