'use client'

import { Plus, List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { itemColumns } from '@/components/item/columns'
import { ItemDialog } from '@/components/item/dialog'
import { Button } from '@/components/ui/button'

interface ItemDrawerProps {
  afId: number
  afNumero?: string
}

export function ItemDrawer({ afId, afNumero }: ItemDrawerProps) {
  return (
    <GenericDrawer
      title={`Itens da AF ${afNumero}`}
      trigger={
        <Button size="sm">
          <List /> Itens
        </Button>
      }
      entity="item"
      query={{ AF_id: afId }}
      columns={itemColumns}
      createDialog={
        <ItemDialog
          afId={afId}
          afNumero={afNumero}
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
