"use client"

import { Plus } from "lucide-react"
import { GenericDrawer } from "@/components/generic-drawer"
import { columns as itemColumns } from "@/components/item-columns"
import { ItemActionCell } from "@/components/item-action-cell"
import { ItemDialog } from "@/components/item-dialog"
import { useEntityHandlers } from "@/app/handlers"

interface ItemDrawerProps {
  afId: number
}

export function ItemDrawer({ afId }: ItemDrawerProps) {
  const { handleFetch, handleCreate } = useEntityHandlers("item")

  return (
    <GenericDrawer
      title="Itens"
      trigger={
        <button className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <Plus /> Itens
        </button>
      }
      fetchEntities={() => handleFetch({ AF_id: afId })}
      columns={itemColumns}
      actionCell={(item) => <ItemActionCell item={item} />}
      createDialog={
        <ItemDialog
          title="Adicionar Item"
          triggerLabel={<Plus />}
          onSubmit={async (values) =>
            handleCreate({ ...values, AF_id: afId })
          }
        />
      }
    />
  )
}
