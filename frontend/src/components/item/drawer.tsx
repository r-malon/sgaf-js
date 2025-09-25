'use client'

import { Plus, List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { itemColumns } from '@/components/item/columns'
import { ItemDialog } from '@/components/item/dialog'
import { Button } from '@/components/ui/button'
import { type AF } from '@sgaf/shared'

export function ItemDrawer({ af }: { af: AF }) {
  return (
    <GenericDrawer
      title={`Itens da AF ${af.numero}`}
      trigger={
        <Button size="sm">
          <List /> Itens
        </Button>
      }
      entity="item"
      query={{ afId: af.id }}
      columns={itemColumns}
      meta={{ afId: af.id, isPrincipal: af.principal }}
      createDialog={
        <ItemDialog
          principalId={af.id}
          afNumero={af.numero}
          triggerLabel={
            <>
              <Plus /> Item
            </>
          }
        />
      }
    />
  )
}
