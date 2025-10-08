'use client'

import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { BaseDialog } from '@/components/base-dialog'
import { getFieldInput } from '@/components/field-input'
import { useEntityHandlers } from '@/lib/handlers'
import { useAPISWR } from '@/lib/hooks'
import { attachLocaisSchema, type Item, type Local } from '@sgaf/shared'

type AttachLocaisForm = z.infer<typeof attachLocaisSchema>

type SelectedState = {
  banda_instalada: number
  data_instalacao: string
  data_desinstalacao: string | null
  quantidade: number
  status: boolean
}

interface LocalAttachDialogProps {
  item: Item
  triggerLabel: React.ReactElement | string
  title?: React.ReactElement | string
}

export function LocalAttachDialog({
  item,
  triggerLabel,
  title,
}: LocalAttachDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  const [cache, setCache] = React.useState<Record<number, SelectedState>>({})

  const { handleCreate } = useEntityHandlers('instalacao')
  const { key } = useEntityHandlers('local')
  const { data: allLocals = [], isLoading } = useAPISWR<Local>(key())

  const form = useForm<AttachLocaisForm>({
    resolver: zodResolver(attachLocaisSchema),
    defaultValues: {
      itemId: item.id,
      locais: [],
    },
    mode: 'onBlur',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'locais',
  })

  const attachedLocalIds = React.useMemo(
    () => new Set(item.locais.map((l) => l.id)),
    [item.locais],
  )

  const availableLocals = React.useMemo(
    () => allLocals.filter((local) => !attachedLocalIds.has(local.id)),
    [allLocals, attachedLocalIds],
  )

  const currentQuantidadeTotal = React.useMemo(
    () => item.locais.reduce((sum, l) => sum + l.quantidade, 0),
    [item.locais],
  )

  const selectedQuantidadeTotal = form
    .watch('locais')
    .reduce((sum, l) => sum + (l.quantidade || 0), 0)

  const remainingQuantidade =
    item.quantidade_maxima - currentQuantidadeTotal - selectedQuantidadeTotal

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newIds = Array.from(e.target.selectedOptions, (o) => Number(o.value))
    setSelectedIds(newIds)

    const currentLocalIds = new Set(fields.map((f) => f.localId))
    const toAdd = newIds.filter((id) => !currentLocalIds.has(id))
    const toRemove = fields
      .map((f, idx) => ({ id: f.localId, idx }))
      .filter(({ id }) => !newIds.includes(id))

    toRemove.reverse().forEach(({ id, idx }) => {
      const current = form.getValues(`locais.${idx}`)
      setCache((prev) => ({
        ...prev,
        [id]: {
          banda_instalada: current.banda_instalada ?? 0,
          data_instalacao:
            current.data_instalacao ?? new Date().toISOString().slice(0, 10),
          data_desinstalacao: current.data_desinstalacao ?? null,
          quantidade: current.quantidade ?? 1,
          status: current.status ?? true,
        },
      }))
      remove(idx)
    })

    toAdd.forEach((localId) => {
      const cached = cache[localId]
      append({
        localId,
        banda_instalada: cached?.banda_instalada ?? 0,
        data_instalacao:
          cached?.data_instalacao ?? new Date().toISOString().slice(0, 10),
        data_desinstalacao: cached?.data_desinstalacao ?? null,
        quantidade: cached?.quantidade ?? 1,
        status: cached?.status ?? true,
      })
    })
  }

  function removeLocal(idx: number, localId: number) {
    const current = form.getValues(`locais.${idx}`)
    setCache((prev) => ({
      ...prev,
      [localId]: {
        banda_instalada: current.banda_instalada ?? 0,
        data_instalacao:
          current.data_instalacao ?? new Date().toISOString().slice(0, 10),
        data_desinstalacao: current.data_desinstalacao ?? null,
        quantidade: current.quantidade ?? 1,
        status: current.status ?? true,
      },
    }))
    remove(idx)
    setSelectedIds((prev) => prev.filter((id) => id !== localId))
  }

  async function onSubmit(values: AttachLocaisForm) {
    await handleCreate(values)
    resetDialog()
  }

  function resetDialog() {
    setOpen(false)
    form.reset({ itemId: item.id, locais: [] })
    setSelectedIds([])
    setCache({})
  }

  const hasBandaExceeded = fields.some((_, idx) => {
    const bandaInstalada = form.watch(`locais.${idx}.banda_instalada`) || 0
    return bandaInstalada > item.banda_maxima
  })

  return (
    <BaseDialog
      triggerLabel={triggerLabel}
      title={
        title ?? (
          <>
            Instalar {item.descricao ?? <Minus color="lightgray" />}
          </>
        )
      }
      contentClassName="sm:max-w-2xl"
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetDialog()
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="local-select">Locais disponíveis</Label>
            <select
              id="local-select"
              multiple
              value={selectedIds.map(String)}
              onChange={handleSelectChange}
              className="w-full border rounded-md p-2 h-48"
            >
              {isLoading ? (
                <option disabled>Carregando...</option>
              ) : availableLocals.length === 0 ? (
                <option disabled>Nenhum local disponível</option>
              ) : (
                availableLocals.map((local) => (
                  <option key={local.id} value={String(local.id)}>
                    {local.nome}
                  </option>
                ))
              )}
            </select>
          </div>

          {fields.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Configurar instalação por local</h3>
              {fields.map((field, idx) => {
                const local = availableLocals.find(
                  (l) => l.id === field.localId,
                )
                const status = form.watch(`locais.${idx}.status`)
                const bandaInstalada =
                  form.watch(`locais.${idx}.banda_instalada`) || 0
                const bandaExceeded = bandaInstalada > item.banda_maxima

                return (
                  <div
                    key={field.id}
                    className="p-3 border rounded-md space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{local?.nome}</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLocal(idx, field.localId)}
                      >
                        <X color="red" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.banda_maxima > 0 && (
                        <FormField
                          control={form.control}
                          name={`locais.${idx}.banda_instalada`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Banda Instalada (max. {item.banda_maxima})
                              </FormLabel>
                              <FormControl>
                                {getFieldInput(
                                  { type: 'number', name: field.name },
                                  field,
                                )}
                              </FormControl>
                              {bandaExceeded && (
                                <p className="text-xs text-red-500">
                                  Excede banda máxima
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name={`locais.${idx}.quantidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Quantidade
                              <span className="text-sm text-muted-foreground">
                                disponível: {remainingQuantidade}/
                                {item.quantidade_maxima}
                              </span>
                            </FormLabel>
                            <FormControl>
                              {getFieldInput(
                                { type: 'number', name: field.name },
                                field,
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`locais.${idx}.data_instalacao`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instalação</FormLabel>
                            <FormControl>
                              {getFieldInput(
                                { type: 'date', name: field.name },
                                field,
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`locais.${idx}.status`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0 pt-8">
                            <FormControl>
                              {getFieldInput(
                                { type: 'switch', name: field.name },
                                field,
                              )}
                            </FormControl>
                            <FormLabel>Ativo?</FormLabel>
                          </FormItem>
                        )}
                      />

                      {!status && (
                        <FormField
                          control={form.control}
                          name={`locais.${idx}.data_desinstalacao`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desinstalação</FormLabel>
                              <FormControl>
                                {getFieldInput(
                                  { type: 'date', name: field.name },
                                  field,
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {remainingQuantidade < 0 && (
            <p className="text-sm text-red-500">
              Quantidade excede o máximo permitido
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={
                fields.length === 0 ||
                remainingQuantidade < 0 ||
                hasBandaExceeded
              }
            >
              Confirmar
            </Button>
          </div>
        </form>
      </Form>
    </BaseDialog>
  )
}
