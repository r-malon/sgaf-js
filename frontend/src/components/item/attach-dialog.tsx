'use client'

import * as React from 'react'
import { z } from 'zod'
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
import { API_BASE_URL } from '@/lib/config'
import { toast } from 'sonner'
import { type Item, attachToAfSchema } from '@sgaf/shared'

type SelectedState = {
  valor: number
  data_inicio: string
  data_fim?: string | null
}

interface AttachDialogProps {
  afId: number
  afNumero?: string
  principalId: number
  triggerLabel?: React.ReactElement | string
  title?: React.ReactElement | string
  onSubmit?: (values: z.infer<typeof attachToAfSchema>) => Promise<void>
}

export function AttachDialog({
  afId,
  afNumero,
  principalId,
  triggerLabel = 'Adicionar Item',
  title,
  onSubmit,
}: AttachDialogProps) {
  const [open, setOpen] = useState(false)
  const { key } = useEntityHandlers('item')
  const { data: principalItems = [], isLoading } = useAPISWR<Item>(
    key({ afId: principalId }),
  )

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [stateById, setStateById] = useState<Record<number, SelectedState>>({})

  // when opening, prefill selected states if needed
  React.useEffect(() => {
    if (!open) return
    // initialize any previously selected ids' state using reasonable defaults
    setStateById((prev) => {
      const copy = { ...prev }
      for (const item of principalItems) {
        if (selectedIds.includes(item.id) && !copy[item.id]) {
          copy[item.id] = {
            valor: 0,
            data_inicio: item.data_instalacao ?? '',
            data_fim: null,
          }
        }
      }
      return copy
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, principalItems])

  const options = useMemo(() => {
    return principalItems
  }, [principalItems])

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions).map((o) =>
      Number(o.value),
    )
    setSelectedIds(selected)
    setStateById((prev) => {
      const copy: Record<number, SelectedState> = {}
      for (const id of selected) {
        copy[id] = prev[id] ?? {
          valor: 0,
          data_inicio: '',
          data_fim: null,
        }
      }
      return copy
    })
  }

  function updateField(itemId: number, patch: Partial<SelectedState>) {
    setStateById((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] ?? { valor: 0, data_inicio: '', data_fim: null }),
        ...patch,
      },
    }))
  }

  async function handleSubmit() {
    if (selectedIds.length === 0) {
      toast.error('Selecione ao menos um item')
      return
    }

    const itemsPayload = selectedIds.map((id) => {
      const s = stateById[id]
      return {
        itemId: id,
        valor: s?.valor ?? 0,
        data_inicio: s?.data_inicio ?? '',
        data_fim: s?.data_fim ?? null,
      }
    })

    // basic validation
    for (const item of itemsPayload) {
      if (!item.data_inicio) {
        toast.error('Data de início obrigatória para todos os itens')
        return
      }
      if (
        item.data_fim &&
        new Date(item.data_fim) < new Date(item.data_inicio)
      ) {
        toast.error('Data final não pode ser anterior à data inicial')
        return
      }
    }

    try {
      if (onSubmit) {
        await onSubmit({ afId, items: itemsPayload })
      } else {
        // default behavior: POST to backend endpoint (optional)
        const res = await fetch(`${API_BASE_URL}/valor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ afId, items: itemsPayload }),
        })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.message ?? `HTTP ${res.status}`)
        }
      }

      toast.success('Itens anexados com sucesso')
      setOpen(false)
      setSelectedIds([])
      setStateById({})
    } catch (err: any) {
      toast.error('Falha ao anexar itens', {
        description: err?.message ?? 'Erro inesperado',
      })
    }
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
          <div>
            <Label>Itens disponíveis (AF principal)</Label>
            <div className="mt-2">
              <select
                multiple
                value={selectedIds.map(String)}
                onChange={handleSelectChange}
                className="w-full border rounded-md p-2 h-48"
                aria-label="Selecionar itens da AF principal"
              >
                {isLoading ? (
                  <option disabled>Carregando...</option>
                ) : options.length === 0 ? (
                  <option disabled>Nenhum item encontrado</option>
                ) : (
                  options.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.descricao ?? `Item ${item.id}`} — {item.local ?? ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="space-y-3">
              <div className="font-medium">Editar valor e datas (por item)</div>
              {selectedIds.map((id) => {
                const item = principalItems.find((p) => p.id === id)
                const st = stateById[id] ?? {
                  valor: 0,
                  data_inicio: item?.data_instalacao ?? '',
                  data_fim: null,
                }
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
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          const next = selectedIds.filter((x) => x !== id)
                          setSelectedIds(next)
                          setStateById((prev) => {
                            const copy = { ...prev }
                            delete copy[id]
                            return copy
                          })
                        }}
                      >
                        Remover
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <Label>Valor</Label>
                        <MoneyInput
                          value={st.valor}
                          onChange={(v) => updateField(id, { valor: v })}
                        />
                      </div>

                      <div>
                        <Label>Início</Label>
                        <Input
                          type="date"
                          value={st.data_inicio}
                          onChange={(e) =>
                            updateField(id, { data_inicio: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label>Fim</Label>
                        <Input
                          type="date"
                          value={st.data_fim ?? ''}
                          onChange={(e) =>
                            updateField(id, {
                              data_fim:
                                e.target.value === '' ? null : e.target.value,
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
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false)
                setSelectedIds([])
                setStateById({})
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Confirmar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
