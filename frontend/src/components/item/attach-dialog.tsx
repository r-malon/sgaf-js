'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MoneyInput } from '@/components/money-input'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'
import { type Item } from '@sgaf/shared'

type SelectedState = {
  valor: number
  data_inicio: string
  data_fim?: string | null
}

interface AttachDialogProps {
  afId: number
  afNumero?: string
  principalId: number
  triggerLabel: React.ReactElement | string
  title?: React.ReactElement | string
}

export function AttachDialog({
  afId,
  afNumero,
  principalId,
  triggerLabel,
  title,
}: AttachDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [stateById, setStateById] = useState<Record<number, SelectedState>>({})

  const { key } = useEntityHandlers('item')
  const { data: principalItems = [], isLoading } = useAPISWR<Item>(
    key({ afId: principalId }),
  )
  const { handleCreate } = useEntityHandlers('valor')

  const availableItems = useMemo(() => principalItems, [principalItems])

  React.useEffect(() => {
    if (!open) return
    setStateById((prev) => {
      const updated = { ...prev }
      selectedIds.forEach((id) => {
        if (!updated[id]) {
          const item = principalItems.find((i) => i.id === id)
          updated[id] = {
            valor: 0,
            data_inicio: item?.data_instalacao ?? '',
            data_fim: null,
          }
        }
      })
      return updated
    })
  }, [open, selectedIds, principalItems])

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions, (o) =>
      Number(o.value),
    )
    setSelectedIds(selected)
  }

  function updateItemField(itemId: number, patch: Partial<SelectedState>) {
    setStateById((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...patch },
    }))
  }

  function removeItem(id: number) {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id))
    setStateById((prev) => {
      const { [id]: _, ...rest } = prev
      return rest
    })
  }

  async function handleSubmit() {
    await handleCreate({
      afId,
      items: selectedIds.map((id) => ({
        itemId: id,
        ...stateById[id],
      })),
    })
    resetDialog()
  }

  function resetDialog() {
    setOpen(false)
    setSelectedIds([])
    setStateById({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {title ?? `Adicionar itens à AF ${afNumero ?? afId}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-select">
              Itens disponíveis (AF principal)
            </Label>
            <select
              id="item-select"
              multiple
              value={selectedIds.map(String)}
              onChange={handleSelectChange}
              className="w-full border rounded-md p-2 h-48"
            >
              {isLoading ? (
                <option disabled>Carregando...</option>
              ) : availableItems.length === 0 ? (
                <option disabled>Nenhum item encontrado</option>
              ) : (
                availableItems.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.descricao ?? `Item ${item.id}`} — {item.local ?? ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Configurar valores por item</h3>
              {selectedIds.map((id) => {
                const item = principalItems.find((p) => p.id === id)
                const state = stateById[id]
                if (!state) return null

                return (
                  <div key={id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-medium">
                          {item?.descricao ?? `Item ${id}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item?.local ?? ''}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(id)}
                      >
                        Remover
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`valor-${id}`}>Valor</Label>
                        <MoneyInput
                          id={`valor-${id}`}
                          value={state.valor}
                          onChange={(v) => updateItemField(id, { valor: v })}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`inicio-${id}`}>Início</Label>
                        <Input
                          id={`inicio-${id}`}
                          type="date"
                          value={state.data_inicio}
                          onChange={(e) =>
                            updateItemField(id, { data_inicio: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor={`fim-${id}`}>Fim</Label>
                        <Input
                          id={`fim-${id}`}
                          type="date"
                          value={state.data_fim ?? ''}
                          onChange={(e) =>
                            updateItemField(id, {
                              data_fim: e.target.value || null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={resetDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={selectedIds.length === 0}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
