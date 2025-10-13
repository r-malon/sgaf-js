'use client'

import { memo } from 'react'
import { Minus } from 'lucide-react'
import { DescriptionCell } from '@/components/description-cell'

interface TruncColumnCellProps {
  text: string
  trunc?: number
}

export const TruncColumnCell = memo(function TruncColumnCell({
  text,
  trunc = 20,
}: TruncColumnCellProps) {
  if (!text) return <Minus color="lightgray" />
  return text.length > trunc ? (
    <DescriptionCell trunc={trunc} text={text} />
  ) : (
    <span>{text}</span>
  )
})
