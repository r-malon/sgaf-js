'use client'

import { Plus, List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { afColumns } from '@/components/af/columns'
import { AFDialog } from '@/components/af/dialog'
import { Button } from '@/components/ui/button'

interface AFDrawerProps {
  contratoId: number
  contratoNumero?: string
}

export function AFDrawer({ contratoId, contratoNumero }: AFDrawerProps) {
  return (
    <GenericDrawer
      title={`AFs do contrato ${contratoNumero}`}
      trigger={
        <Button size="sm">
          <List /> AFs
        </Button>
      }
      entity="af"
      query={{ Contrato_id: contratoId }}
      columns={afColumns}
      rowClassName={(row) =>
        row.original.principal ? 'bg-green-100' : undefined
      }
      createDialog={
        <AFDialog
          contratoId={contratoId}
          contratoNumero={contratoNumero}
          triggerLabel={
            <>
              <Plus /> AF
            </>
          }
        />
      }
    />
  )
}
