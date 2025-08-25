"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { ItemActionCell } from "@/components/item-action-cell"
import { DescriptionCell } from "@/components/description-cell"
import { Item } from "@sgaf/shared"

export const itemColumns: ColumnDef<Item>[] = [
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => <DescriptionCell text={row.original.descricao} />,
  },
  {
    accessorKey: "banda_maxima",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Banda Máxima" />,
  },
  {
    accessorKey: "banda_instalada",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Banda Instalada" />,
  },
  {
    accessorKey: "data_instalacao",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Instalação" />,
    cell: ({ row }) => row.original.data_instalacao.slice(0, 10),
  },
  {
    accessorKey: "quantidade",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Qtd." />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ativo?" />,
    cell: ({ row }) => (row.original.status ? <Check strokeWidth={4} color="green" /> : <X strokeWidth={4} color="red" />),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => <ItemActionCell item={row.original} />,
  },
]
