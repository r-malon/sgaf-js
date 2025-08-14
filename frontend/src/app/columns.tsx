"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"

export type AF = {
  id: number
  numero: string
  fornecedor: string
  descricao: string
  data_inicio: string
  data_fim: string
  status: bool
}

export const columns: ColumnDef<AF>[] = [
  {
    accessorKey: "numero",
    header: ({ column }) => {
      <DataTableColumnHeader column={column} title="Número" />
    },
  },
  {
    accessorKey: "fornecedor",
    header: "Fornecedor",
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
    header: "Status",
  },
]
