import { Pencil, Plus, Trash2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemDialog } from '@/components/item/dialog'
import { useEntityHandlers } from '@/app/handlers'
import { ActionCell } from '@/components/action-cell'
import { ValorTableDialog } from '@/components/valor/table-dialog'

export function ItemActionCell({ item }: { item: any }) {
  const { handleEdit, handleDelete } = useEntityHandlers('item')

  return (
    <ActionCell
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
          key: 'list-valores',
          // show: (item) => item.valor_count > 0,
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
