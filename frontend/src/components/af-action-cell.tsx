import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AFDialog } from "@/components/af-dialog"
import { useEntityHandlers } from "@/app/handlers"
import { ActionCell } from "@/components/action-cell"

export function AFActionCell({ af }: { af: any }) {
  const { handleEdit, handleDelete } = useEntityHandlers("af")

  return (
    <ActionCell
      entity={af}
      actions={[
        {
          key: "edit",
          render: (af) => (
            <AFDialog
              af={af}
              triggerLabel={<Pencil className="h-4 w-4" />}
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
              size="sm"
              onClick={() => handleDelete(af.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ),
        },
        {
          key: "add-item",
          render: (af) => (
            <Button
              size="sm"
              onClick={() => console.log(`Add item to AF ${af.id}`)}
            >
              <Plus className="h-4 w-4" /> Item
            </Button>
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
              List Items
            </Button>
          ),
        },
      ]}
    />
  )
}
