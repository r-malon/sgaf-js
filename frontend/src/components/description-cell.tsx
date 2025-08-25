"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DescriptionCellProps {
  text: string
  trunc: number
  title?: string
}

export function DescriptionCell({ text, trunc, title = "Descrição completa" }: DescriptionCellProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <span
        className="cursor-pointer hover:underline"
        onClick={() => setOpen(true)}
      >
        {text.slice(0, trunc).trimEnd() + "…"}
      </span>

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
    </>
  )
}
