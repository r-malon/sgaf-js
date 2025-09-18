import { Pencil, Plus, Trash2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemDialog } from '@/components/item/dialog'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { ValorTableDialog } from '@/components/valor/table-dialog'
import { type Item } from '@sgaf/shared'

export function ItemActionCell({ item }: { item: Item }) {
  const { handleEdit, handleDelete } = useEntityHandlers('item')

  return (
    <ActionCell<Item>
      entity={item}
      actions={[
        {
          key: 'edit',
          render: (item) => (
            <ItemDialog
              item={item}
              afId={item.AF_id}
              triggerLabel={<Pencil />}
            />
          ),
        },
        {
          key: 'delete',
          show: (item) => item.valor_count === 0,
          render: (item) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
        {
          key: 'list-valores',
          show: (item) => item.valor_count > 0,
          render: (item) => (
            <ValorTableDialog
              itemId={item.id}
              triggerLabel={
                <>
                  <List /> Valores
                </>
              }
            />
          ),
        },
      ]}
    />
  )
}
