import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { AFDialog } from '@/components/af/dialog'
import { ItemDialog } from '@/components/item/dialog'
import { ItemDrawer } from '@/components/item/drawer'
import { type AF } from '@sgaf/shared'

export function AFActionCell({ af }: { af: AF }) {
  const { handleEdit, handleDelete } = useEntityHandlers('af')
  const { handleCreate } = useEntityHandlers('item')

  return (
    <ActionCell<AF>
      entity={af}
      actions={[
        {
          key: 'edit',
          render: (af) => (
            <AFDialog
              af={af}
              contratoId={af.Contrato_id}
              triggerLabel={<Pencil />}
            />
          ),
        },
        {
          key: 'delete',
          show: (af) => af.item_count === 0,
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
          key: 'add-item',
          show: (af) => af.status,
          render: (af) => (
            <ItemDialog
              afId={af.id}
              afNumero={af.numero}
              triggerLabel={
                <>
                  <Plus /> Item
                </>
              }
            />
          ),
        },
        {
          key: 'list-items',
          show: (af) => af.item_count > 0,
          render: (af) => <ItemDrawer afId={af.id} afNumero={af.numero} />,
        },
      ]}
    />
  )
}
