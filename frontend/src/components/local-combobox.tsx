"use client"

import * as React from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Trash2, Pencil } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { useEntityHandlers } from "@/app/handlers"
import { LocalDialog } from "@/components/local-dialog"

interface Local {
  id: number
  nome: string
}

const fetcher = async (url: string): Promise<Local[]> => {
  const res = await fetch(url)
  const json = await res.json()
  if (Array.isArray(json)) return json
  if (json?.data && Array.isArray(json.data)) return json.data
  return [] // fallback safe return
}

export function LocalCombobox() {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Local | null>(null)

  const { data: locals = [] } = useSWR<Local[]>(`${API_BASE_URL}/local`, fetcher)
  const { handleEdit, handleDelete } = useEntityHandlers("Local")

  async function handleRemove(id: number) {
    await handleDelete(id)
    if (selected?.id === id) {
      setSelected(null)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className="w-[200px] justify-between"
          >
            {selected ? selected.nome : "Selecionar local..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar local..." />
            <CommandList>
              <CommandEmpty>Nenhum local encontrado.</CommandEmpty>
              <CommandGroup>
                {locals.map((local) => (
                  <CommandItem
                    key={local.id}
                    value={local.nome}
                    onSelect={() => {
                      setSelected(local)
                      setOpen(false)
                    }}
                  >
                    {local.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <div className="flex gap-2 mt-2">
          <LocalDialog
            local={selected}
            triggerLabel={<Pencil />}
            title="Editar local"
            onSubmit={async (values) => {
              if (!selected) return
              await handleEdit(selected.id, values)
              setSelected(null)
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
