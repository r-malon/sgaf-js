import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemLocalDialog } from '@/components/item-local/dialog'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { type ItemLocal } from '@sgaf/shared'

export function ItemLocalActionCell({ itemLocal }: { itemLocal: ItemLocal }) {
  const { handleDelete } = useEntityHandlers('item-local')

  return (
    <ActionCell<ItemLocal>
      entity={itemLocal}
      actions={[
        {
          key: 'edit',
          render: (itemLocal) => (
            <ItemLocalDialog itemLocal={itemLocal} triggerLabel={<Pencil />} />
          ),
        },
        {
          key: 'delete',
          render: (itemLocal) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(itemLocal.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
      ]}
    />
  )
}
