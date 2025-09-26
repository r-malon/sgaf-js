'use client'

import * as React from 'react'
import { z, ZodType } from 'zod'
import { useForm, type Resolver, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { MoneyInput } from '@/components/money-input'

type BaseFieldConfig = {
  name: string
  label?: React.ReactElement | string
  description?: string
  show?: boolean
}

export type FieldConfig =
  | (BaseFieldConfig & { type: 'text' })
  | (BaseFieldConfig & { type: 'textarea' })
  | (BaseFieldConfig & { type: 'number' })
  | (BaseFieldConfig & { type: 'money' })
  | (BaseFieldConfig & { type: 'date' })
  | (BaseFieldConfig & { type: 'switch' })
  | (BaseFieldConfig & {
      type: 'custom'
      render: (field: {
        value: any
        onChange: (val: any) => void
        name: string
      }) => React.ReactNode
    })

interface GenericDialogFormProps<TSchema extends ZodType<any, any>> {
  schema: TSchema
  defaultValues: z.input<TSchema>
  fields: FieldConfig[]
  title: React.ReactElement | string
  triggerLabel: React.ReactElement | string
  onSubmit: (values: z.output<TSchema>) => Promise<void>
}

export function GenericDialogForm<TSchema extends ZodType<any, any>>({
  schema,
  defaultValues,
  fields,
  title,
  triggerLabel,
  onSubmit,
}: GenericDialogFormProps<TSchema>) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.input<TSchema>>({
    resolver: zodResolver(schema) as Resolver<z.input<TSchema>>,
    defaultValues,
    mode: 'onBlur',
  })

  const handleSubmit = async (values: z.input<TSchema>) => {
    await onSubmit(values as z.output<TSchema>)
    setOpen(false)
    form.reset(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {fields.map((field) => {
              if (field.show === false) return null
              return (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as FieldPath<z.input<TSchema>>}
                  render={({ field: controlledField }) => (
                    <FormItem>
                      {field.label && <FormLabel>{field.label}</FormLabel>}
                      {(() => {
                        switch (field.type) {
                          case 'custom':
                            return (
                              <FormControl>
                                {field.render(controlledField)}
                              </FormControl>
                            )
                          case 'text':
                            return (
                              <FormControl>
                                <Input {...controlledField} />
                              </FormControl>
                            )
                          case 'textarea':
                            return (
                              <FormControl>
                                <Textarea {...controlledField} />
                              </FormControl>
                            )
                          case 'number':
                            // type="text" bypasses Firefox’s buggy type="number"
                            return (
                              <FormControl>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="\d*"
                                  min="0"
                                  {...controlledField}
                                  onChange={(e) => {
                                    const onlyDigits = e.target.value.replace(
                                      /\D/g,
                                      '',
                                    )
                                    controlledField.onChange(
                                      onlyDigits
                                        ? parseInt(onlyDigits, 10)
                                        : undefined,
                                    )
                                  }}
                                />
                              </FormControl>
                            )
                          case 'money':
                            return (
                              <FormControl>
                                <MoneyInput {...controlledField} />
                              </FormControl>
                            )
                          case 'date':
                            return (
                              <FormControl>
                                <Input type="date" {...controlledField} />
                              </FormControl>
                            )
                          case 'switch':
                            return (
                              <FormControl>
                                <Switch
                                  checked={Boolean(controlledField.value)}
                                  onCheckedChange={controlledField.onChange}
                                />
                              </FormControl>
                            )
                          default:
                            return null
                        }
                      })()}

                      {field.description && (
                        <FormDescription>{field.description}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            })}

            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
