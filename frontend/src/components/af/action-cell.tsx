import { Pencil, Plus, Link, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { AFDialog } from '@/components/af/dialog'
import { AttachDialog } from '@/components/item/attach-dialog'
import { ItemDialog } from '@/components/item/dialog'
import { ItemDrawer } from '@/components/item/drawer'
import { type AF } from '@sgaf/shared'

export function AFActionCell({
  af,
  principalId,
}: {
  af: AF
  principalId: number
}) {
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
              contratoId={af.contratoId}
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
          render: (af) =>
            af.principal ? (
              <ItemDialog
                principalId={af.id}
                afNumero={af.numero}
                triggerLabel={
                  <>
                    <Plus /> Item
                  </>
                }
              />
            ) : (
              <AttachDialog
                principalId={af.principal ? af.id : principalId}
                afId={af.id}
                afNumero={af.numero}
                triggerLabel={
                  <>
                    <Link /> Itens
                  </>
                }
              />
            ),
        },
        {
          key: 'list-items',
          show: (af) => af.item_count > 0,
          render: (af) => <ItemDrawer af={af} />,
        },
      ]}
    />
  )
}
