'use client'

import { memo } from 'react'
import { Minus } from 'lucide-react'
import { DescriptionCell } from '@/components/description-cell'

interface DescricaoColumnCellProps {
  descricao: string
}

export const DescricaoColumnCell = memo(function DescricaoColumnCell({
  descricao,
}: DescricaoColumnCellProps) {
  if (descricao === '') return <Minus color="lightgray" />
  return descricao.length > 20 ? (
    <DescriptionCell trunc={20} text={descricao} />
  ) : (
    <span>{descricao}</span>
  )
})
