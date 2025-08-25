import { Pencil, Plus, Trash2, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEntityHandlers } from "@/app/handlers"
import { ActionCell } from "@/components/action-cell"
import { AFDialog } from "@/components/af-dialog"
import { ItemDialog } from "@/components/item-dialog"

export function AFActionCell({ af }: { af: any }) {
  const { handleEdit, handleDelete } = useEntityHandlers("af")
  const { handleCreate } = useEntityHandlers("item")

  return (
    <ActionCell
      entity={af}
      actions={[
        {
          key: "edit",
          render: (af) => (
            <AFDialog
              af={af}
              triggerLabel={<Pencil />}
              title="Editar AF"
              onSubmit={(values) => handleEdit(af.id, values)}
            />
          ),
        },
        {
          key: "delete",
          render: (af) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(af.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
        {
          key: "add-item",
          render: (af) => (
            <ItemDialog
              triggerLabel={<><Plus strokeWidth={4} /> Item</>}
              title="Adicionar Item"
              onSubmit={async (values) => {
                await handleCreate({ ...values, AF_id: af.id })
              }}
            />
          ),
        },
        {
          key: "list-items",
          show: (af) => af.items?.length > 0,
          render: (af) => (
            <Button
              size="sm"
              onClick={() => console.log(`List items of AF ${af.id}`)}
            >
              <List strokeWidth={4} /> Itens
            </Button>
          ),
        },
      ]}
    />
  )
}
