'use client'

import { memo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DescriptionCellProps {
  text: string
  trunc: number
  title?: string
}

export const DescriptionCell = memo(function DescriptionCell({
  text,
  trunc,
  title = 'Descrição completa',
}: DescriptionCellProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <span
        className="cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
      >
        {text.slice(0, trunc).trimEnd() + '…'}
      </span>

      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
              {text}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
})
