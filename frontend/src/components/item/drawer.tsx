'use client'

import { Plus, List } from 'lucide-react'
import { GenericDrawer } from '@/components/generic-drawer'
import { itemColumns } from '@/components/item/columns'
import { ItemDialog } from '@/components/item/dialog'
import { Button } from '@/components/ui/button'

interface ItemDrawerProps {
  afId: number
}

export function ItemDrawer({ afId }: ItemDrawerProps) {
  return (
    <GenericDrawer
      trigger={
        <Button size="sm">
          <List /> Itens
        </Button>
      }
      entityName="item"
      query={{ AF_id: afId }}
      columns={itemColumns}
      createDialog={
        <ItemDialog
          title="Adicionar Item"
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
