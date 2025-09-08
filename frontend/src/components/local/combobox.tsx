'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ChevronsUpDown, Trash2, Pencil } from 'lucide-react'
import { LocalDialog } from '@/components/local/dialog'
import { Local } from '@sgaf/shared'
import { useEntityHandlers } from '@/app/handlers'
import { useAPISWR } from '@/lib/hooks'

type LocalComboboxProps = {
  value?: number | null
  onChange?: (localId: number | null, local: Local | null) => void
  readOnly?: boolean
  className?: string
}

export function LocalCombobox({
  value,
  onChange,
  readOnly = false,
  className,
}: LocalComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalId, setInternalId] = React.useState<number | null>(
    value ?? null,
  )

  // Controlled vs uncontrolled sync
  React.useEffect(() => {
    if (value !== undefined) setInternalId(value)
  }, [value])

  const { key, handleEdit, handleDelete } = useEntityHandlers('local')
  const { data: locals = [] } = useAPISWR<Local>(key())

  const selectedId = value ?? internalId
  const selected = locals.find((l) => l.id === selectedId) ?? null

  const setSelected = (next: Local | null) => {
    onChange?.(next?.id ?? null, next)
    if (value === undefined) setInternalId(next?.id ?? null)
    setOpen(false)
  }

  async function handleRemove(id: number) {
    await handleDelete(id)
    if ((value ?? internalId) === id) {
      onChange?.(null, null)
      if (value === undefined) setInternalId(null)
    }
  }

  return (
    <div className={`flex items-start gap-2 ${className ?? ''}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className="w-[220px] justify-between"
          >
            {selected ? selected.nome : 'Selecionar local...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput placeholder="Buscar local..." />
            <CommandList>
              <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
              <CommandGroup>
                {locals.map((local) => (
                  <CommandItem
                    key={local.id}
                    value={local.nome}
                    onSelect={() => setSelected(local)}
                  >
                    {local.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && !readOnly && (
        <div className="flex gap-2">
          <LocalDialog
            key={selected.id}
            local={selected}
            triggerLabel={<Pencil />}
            title="Editar local"
            onSubmit={async (values) => {
              await handleEdit(selected.id, values)
              // keep selection (id doesn’t change), no need to clear
              onChange?.(selected.id, { ...selected, ...values })
            }}
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleRemove(selected.id)}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  )
}
