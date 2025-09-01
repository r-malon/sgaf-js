import { Pencil, Plus, Trash2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ItemDialog } from "@/components/item/dialog"
import { useEntityHandlers } from "@/app/handlers"
import { ActionCell } from "@/components/action-cell"

export function ItemActionCell({ item }: { item: any }) {
  const { handleEdit, handleDelete } = useEntityHandlers("item")

  return (
    <ActionCell
      entity={item}
      actions={[
        {
          key: "edit",
          render: (item) => (
            <ItemDialog
              item={item}
              triggerLabel={<Pencil />}
              title="Editar Item"
              onSubmit={(values) => handleEdit(item.id, values)}
            />
          ),
        },
        {
          key: "delete",
          render: (item) => (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
        {
          key: "add-valor",
          render: (item) => (
            <Button
              size="sm"
              onClick={() => console.log(`Adicionar valor ao Item ${item.id}`)}
            >
              <Plus strokeWidth={4} /> Valor
            </Button>
          ),
        },
      ]}
    />
  )
}
