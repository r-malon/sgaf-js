"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { ValorActionCell } from "@/components/af/action-cell"
import { Valor } from "@sgaf/shared"

export const valorColumns: ColumnDef<Valor>[] = [
  {
    accessorKey: "valor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor (R$)" />,
    cell: ({ row }) => {
      const cents = row.original.valor
      return (cents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
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
    id: "actions",
    cell: ({ row }) => <ValorActionCell valor={row.original} />,
  },
]
