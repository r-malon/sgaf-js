"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { useEntityHandlers } from "./handlers"
import { AFDialog } from "@/components/af-dialog"
import { AF } from "./types"

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
    cell: ({ row }) => (row.original.status ? "✅" : "❌"),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const af = row.original
      const { handleEdit, handleDelete } = useEntityHandlers("af")

      return (
        <div className="flex gap-2">
          <AFDialog
            af={af}
            triggerLabel={<Pencil className="h-4 w-4" />}
            title="Editar AF"
            onSubmit={(values) => handleEdit(af.id, values)}
          />

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(af.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Placeholders */}
          <Button
            size="sm"
            onClick={() => console.log(`Add item to AF ${af.id}`)}
          >
            <Plus className="h-4 w-4" /> Item
          </Button>
          <Button
            size="sm"
            onClick={() => console.log(`List items of AF ${af.id}`)}
          >
            List Items
          </Button>
        </div>
      )
    },
  },
]
