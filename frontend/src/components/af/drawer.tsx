'use client'

import { useMemo } from 'react'
import { Plus, List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { afColumns } from '@/components/af/columns'
import { AFDialog } from '@/components/af/dialog'
import { Button } from '@/components/ui/button'
import { type AF } from '@sgaf/shared'
import { useAPISWR } from '@/lib/hooks'
import { useEntityHandlers } from '@/lib/handlers'

interface AFDrawerProps {
  contratoId: number
  contratoNumero?: string
}

export function AFDrawer({ contratoId, contratoNumero }: AFDrawerProps) {
  const { key } = useEntityHandlers('af')
  const { data: afs = [] } = useAPISWR<AF>(key({ contratoId }))

  const principalId = useMemo(() => {
    return afs.find((af) => af.principal)?.id
  }, [afs])
  return (
    <GenericDrawer
      title={`AFs do contrato ${contratoNumero}`}
      trigger={
        <Button size="sm">
          <List /> AFs
        </Button>
      }
      entity="af"
      query={{ contratoId }}
      columns={afColumns}
      rowClassName={(row) =>
        row.original.principal ? 'bg-blue-100' : undefined
      }
      rowProps={{ principalId }}
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
