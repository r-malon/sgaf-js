'use client'

import * as React from 'react'
import { useState, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { BaseDialog } from '@/components/base-dialog'
import { getFieldInput } from '@/components/field-input'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'
import { type Item, attachToAfSchema } from '@sgaf/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ItemAttachDialogProps {
  afId: number
  afNumero?: string
  principalId: number
  triggerLabel: React.ReactElement | string
  title?: React.ReactElement | string
}

export function ItemAttachDialog({
  afId,
  afNumero,
  principalId,
  triggerLabel,
  title,
}: ItemAttachDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { handleCreate } = useEntityHandlers('valor')
  const { key } = useEntityHandlers('item')
  const { data: principalItems = [], isLoading: loadingPrincipal } =
    useAPISWR<Item>(key({ afId: principalId }))
  const { data: attachedItems = [], isLoading: loadingAttached } =
    useAPISWR<Item>(key({ afId }))

  const availableItems = useMemo(() => {
    const attachedIds = new Set(attachedItems.map((item) => item.id))
    return principalItems.filter((item) => !attachedIds.has(item.id))
  }, [principalItems, attachedItems])

  const form = useForm<z.input<typeof attachToAfSchema>>({
    resolver: zodResolver(attachToAfSchema),
    defaultValues: {
      afId,
      items: [],
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = Array.from(e.target.selectedOptions, (o) =>
      Number(o.value),
    )
    setSelectedIds(selected)

    const currentItemIds = new Set(fields.map((f) => f.itemId))
    const toAdd = selected.filter((id) => !currentItemIds.has(id))
    const toRemove = fields
      .map((f, idx) => ({ itemId: f.itemId, idx }))
      .filter(({ itemId }) => !selected.includes(itemId))

    toRemove.reverse().forEach(({ idx }) => remove(idx))
    toAdd.forEach((id) => {
      const item = availableItems.find((i) => i.id === id)
      append({
        itemId: id,
        valor: 0,
        data_inicio: '',
        data_fim: null,
      })
    })
  }

  function removeItem(itemId: number) {
    const idx = fields.findIndex((f) => f.itemId === itemId)
    if (idx !== -1) {
      remove(idx)
      setSelectedIds((prev) => prev.filter((id) => id !== itemId))
    }
  }

  async function onSubmit(values: z.input<typeof attachToAfSchema>) {
    await handleCreate(values)
    resetDialog()
  }

  function resetDialog() {
    setOpen(false)
    setSelectedIds([])
    form.reset({ afId, items: [] })
  }

  return (
    <BaseDialog
      triggerLabel={triggerLabel}
      title={title ?? `Adicionar itens à AF ${afNumero ?? afId}`}
      contentClassName="sm:max-w-2xl"
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetDialog()
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {loadingPrincipal || loadingAttached ? (
                <option disabled>Carregando...</option>
              ) : availableItems.length === 0 ? (
                <option disabled>Nenhum item encontrado</option>
              ) : (
                availableItems.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.descricao ?? `Item ${item.id}`}
                  </option>
                ))
              )}
            </select>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Configurar valores por item</h3>
              {fields.map((field, idx) => {
                const item = availableItems.find((p) => p.id === field.itemId)
                return (
                  <div key={field.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">
                        {item?.descricao ?? `Item ${field.itemId}`}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(field.itemId)}
                      >
                        Remover
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name={`items.${idx}.valor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl>
                              {getFieldInput(
                                { name: 'valor', type: 'money' },
                                field,
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${idx}.data_inicio`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início</FormLabel>
                            <FormControl>
                              {getFieldInput(
                                { name: 'data_inicio', type: 'date' },
                                field,
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${idx}.data_fim`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fim</FormLabel>
                            <FormControl>
                              {getFieldInput(
                                { name: 'data_fim', type: 'date' },
                                field,
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={resetDialog}>
              Cancelar
            </Button>
            <Button type="submit" disabled={fields.length === 0}>
              Confirmar
            </Button>
          </div>
        </form>
      </Form>
    </BaseDialog>
  )
}
