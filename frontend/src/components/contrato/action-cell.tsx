import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntityHandlers } from '@/lib/handlers'
import { ActionCell } from '@/components/action-cell'
import { ContratoDialog } from '@/components/contrato/dialog'
import { AFDialog } from '@/components/af/dialog'
import { AFDrawer } from '@/components/af/drawer'
import { type Contrato } from '@sgaf/shared'

export function ContratoActionCell({ contrato }: { contrato: Contrato }) {
  const { handleEdit, handleDelete } = useEntityHandlers('contrato')

  return (
    <ActionCell<Contrato>
      entity={contrato}
      actions={[
        {
          key: 'edit',
          render: (contrato) => (
            <ContratoDialog
              contrato={contrato}
              triggerLabel={<Pencil />}
              title="Editar Contrato"
              onSubmit={(values) => handleEdit(contrato.id, values)}
            />
          ),
        },
        {
          key: 'delete',
          show: (contrato) => contrato.af_count === 0,
          render: (contrato) => (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(contrato.id)}
            >
              <Trash2 />
            </Button>
          ),
        },
        {
          key: 'add-af',
          render: (contrato) => (
            <AFDialog
              contratoId={contrato.id}
              contratoNumero={contrato.numero}
              triggerLabel={
                <>
                  <Plus /> AF
                </>
              }
            />
          ),
        },
        {
          key: 'list-afs',
          show: (contrato) => contrato.af_count > 0,
          render: (contrato) => (
            <AFDrawer
              contratoId={contrato.id}
              contratoNumero={contrato.numero}
            />
          ),
        },
      ]}
    />
  )
}
