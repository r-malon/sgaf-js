"use client"

import { Plus, List } from "lucide-react"
import { GenericDrawer } from "@/components/generic-drawer"
import { itemColumns } from "@/components/item/columns"
import { ItemActionCell } from "@/components/item/action-cell"
import { ItemDialog } from "@/components/item/dialog"
import { useEntityHandlers } from "@/app/handlers"
import { Button } from "@/components/ui/button"

interface ItemDrawerProps {
  afId: number
}

export function ItemDrawer({ afId }: ItemDrawerProps) {
  const { baseUrl, handleCreate } = useEntityHandlers("item")

  return (
    <GenericDrawer
      trigger={
        <Button size="sm">
          <List strokeWidth={4} /> Itens
        </Button>
      }
      url={`${baseUrl}?AF_id=${afId}`}
      columns={itemColumns}
      createDialog={
        <ItemDialog
          title="Adicionar Item"
          triggerLabel={<Plus />}
        />
      }
    />
  )
}
