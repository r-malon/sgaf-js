import { Pencil, Trash2, List, Link, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ItemDialog } from '@/components/item/dialog'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { ValorTableDialog } from '@/components/valor/table-dialog'
import { LocalAttachDialog } from '@/components/local/attach-dialog'
import { InstalacaoTableDialog } from '@/components/instalacao/table-dialog'
import { type Item } from '@sgaf/shared'

export function ItemActionCell({
  item,
  afId,
  isPrincipal,
}: {
  item: Item
  afId: number
  isPrincipal: boolean
}) {
  const { handleDelete } = useEntityHandlers('item')

  return (
    <ActionCell<Item>
      entity={item}
      actions={[
        {
          key: 'edit',
          show: () => isPrincipal,
          render: (item) => (
            <ItemDialog
              item={item}
              principalId={item.principalId}
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
              afId={afId}
              triggerLabel={
                <>
                  <List /> <DollarSign color="green" />
                </>
              }
            />
          ),
        },
        {
          key: 'link-locais',
          show: () => isPrincipal,
          render: (item) => (
            <LocalAttachDialog
              item={item}
              triggerLabel={
                <>
                  <Link /> <MapPin />
                </>
              }
            />
          ),
        },
        {
          key: 'list-instalados',
          show: (item) => item.instalados_count > 0,
          render: (item) => (
            <InstalacaoTableDialog
              itemId={item.id}
              triggerLabel={
                <>
                  <MapPin /> Instalados
                </>
              }
            />
          ),
        },
      ]}
    />
  )
}
