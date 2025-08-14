"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Plus, Trash2, Pencil } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { handleDelete, handleEdit } from "./handlers"

export type AF = {
  id: number
  numero: string
  fornecedor: string
  descricao: string
  data_inicio: string
  data_fim: string
  status: boolean
}

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
  },
  {
    accessorKey: "data_fim",
    header: "Fim",
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
          <Button variant="secondary" size="sm" onClick={() => handleEdit(af)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(af.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
