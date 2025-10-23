import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BaseDialog } from '@/components/base-dialog'

interface Props {
  afId: number
  afNumero: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerLabel?: React.ReactElement | string
}

export function GenerateBordereauDialog({
  afId,
  afNumero,
  open,
  onOpenChange,
  triggerLabel,
}: Props) {
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const router = useRouter()

  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ]

  const years = Array.from({ length: 11 }, (_, i) => (2020 + i).toString())

  const handleGenerate = () => {
    router.push(`/af/${afId}/${year}/${month}`)
    if (onOpenChange) onOpenChange(false)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Gerar bordereau da AF ${afNumero}`}
      triggerLabel={triggerLabel}
    >
      <div className="flex items-center gap-3">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>de</span>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button disabled={!month || !year} onClick={handleGenerate}>
        Gerar
      </Button>
    </BaseDialog>
  )
}
