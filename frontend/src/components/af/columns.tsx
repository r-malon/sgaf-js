"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Minus, Check, X } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { AFActionCell } from "@/components/af/action-cell"
import { DescriptionCell } from "@/components/description-cell"
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
    cell: ({ row }) => {
      const descricao = row.original.descricao
      if (descricao == null) return <Minus strokeWidth={4} color="lightgray" />
      return descricao.length > 20 ? (
        <DescriptionCell trunc={20} text={descricao} />
      ) : (
        <span>{descricao}</span>
      )
    },
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
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <AFActionCell af={row.original} />,
  },
]
