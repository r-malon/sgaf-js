import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEntityHandlers } from "@/app/handlers"
import { ActionCell } from "@/components/action-cell"
import { ValorDialog } from "@/components/valor-dialog"

export function ValorActionCell({ valor, itemId }: { valor: any; itemId: number }) {
  const { handleEdit, handleDelete } = useEntityHandlers("valor")

  return (
    <ActionCell
      entity={valor}
      actions={[
        {
          key: "edit",
          render: (valor) => (
            <ValorDialog
              valor={valor}
              triggerLabel={<Pencil />}
              title="Editar Valor"
              onSubmit={(values) => handleEdit(valor.id, values)}
            />
          ),
        },
        {
          key: "delete",
          render: (valor) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(valor.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
      ]}
    />
  )
}
