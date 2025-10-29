'use client'

import { useMemo } from 'react'
import { List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { useAPISWR } from '@/lib/hooks'
import { useEntityHandlers } from '@/lib/handlers'
import { afColumns } from '@/components/af/columns'
import { AFDialog } from '@/components/af/dialog'
import { type AF } from '@sgaf/shared'

interface AFDrawerProps {
  contratoId: number
  contratoNumero?: string
}

export function AFDrawer({ contratoId, contratoNumero }: AFDrawerProps) {
  const { key } = useEntityHandlers('af')
  const { data: afs = [] } = useAPISWR<AF>(key({ contratoId }))

  const principal = useMemo(() => {
    return afs.find((af) => af.principal)
  }, [afs])

  return (
    <GenericDrawer
      title={`AFs do contrato ${contratoNumero}`}
      triggerLabel={
        <>
          <List /> AFs
        </>
      }
      entity="af"
      query={{ contratoId }}
      columns={afColumns}
      rowClassName={(row) =>
        row.original.principal ? 'bg-blue-100' : undefined
      }
      rowProps={{
        principalId: principal?.id,
        principalItemCount: principal?.item_count,
      }}
      createDialog={<AFDialog contratoId={contratoId} />}
    />
  )
}
