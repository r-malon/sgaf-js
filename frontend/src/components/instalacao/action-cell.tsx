import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InstalacaoDialog } from '@/components/instalacao/dialog'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { type Instalacao } from '@sgaf/shared'

export function InstalacaoActionCell({ instalacao }: { instalacao: Instalacao }) {
  const { handleDelete } = useEntityHandlers('instalacao')

  return (
    <ActionCell<Instalacao>
      entity={instalacao}
      actions={[
        {
          key: 'edit',
          render: (instalacao) => (
            <InstalacaoDialog instalacao={instalacao} triggerLabel={<Pencil />} />
          ),
        },
        {
          key: 'delete',
          render: (instalacao) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(instalacao.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
      ]}
    />
  )
}
