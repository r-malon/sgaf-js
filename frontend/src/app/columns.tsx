"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Plus, Trash2, Pencil } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { handleDelete, handleEdit } from "./handlers"
import { AFDialog } from "@/components/af-dialog"
import { AF } from "./types"
import { API_BASE_URL } from "@/lib/config"
import { mutate } from "swr"

export const columns: ColumnDef<AF>[] = [
  {
    accessorKey: "numero",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Número" />
    },
  },
  {
    accessorKey: "fornecedor",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Fornecedor" />
    },
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "data_inicio",
    header: "Início",
    cell: ({ row }) => row.original.data_inicio.slice(0, 10),
  },
  {
    accessorKey: "data_fim",
    header: "Fim",
    cell: ({ row }) => row.original.data_fim.slice(0, 10),
  },
  {
    accessorKey: "status",
    header: "Ativa?",
    cell: ({ row }) => (row.original.status ? "✅" : "❌"),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const af = row.original
      return (
        <div className="flex gap-2">
          <AFDialog af={af} triggerLabel="Editar" />
          <Button variant="destructive" size="sm" onClick={() => handleDelete("af", "AF", af.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => handleDelete(af.id)}>
            <Plus className="h-4 w-4" /> Item
          </Button>
          <Button size="sm" onClick={() => handleDelete(af.id)}>
            <Plus className="h-4 w-4" /> Item
          </Button>
        </div>
      )
    },
  },
]
