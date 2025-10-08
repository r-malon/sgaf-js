import { Pencil, Plus, Link, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { AFDialog } from '@/components/af/dialog'
import { ItemAttachDialog } from '@/components/item/attach-dialog'
import { ItemDialog } from '@/components/item/dialog'
import { ItemDrawer } from '@/components/item/drawer'
import { type AF } from '@sgaf/shared'

export function AFActionCell({
  af,
  principalId,
  principalItemCount,
}: {
  af: AF
  principalId: number
  principalItemCount: number
}) {
  const { handleDelete } = useEntityHandlers('af')

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
          show: (af) => af.status && af.principal,
          render: (af) => (
            <ItemDialog
              principalId={af.id}
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
          key: 'link-items',
          show: (af) => af.status && !af.principal && principalItemCount > 0,
          render: (af) => (
            <ItemAttachDialog
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
