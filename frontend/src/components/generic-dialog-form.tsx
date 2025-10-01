'use client'

import * as React from 'react'
import { z, ZodType } from 'zod'
import { useForm, type Resolver, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { BaseDialog } from '@/components/base-dialog'
import { type FieldConfig, getFieldInput } from '@/components/field-input'

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

  return (
    <BaseDialog
      triggerLabel={triggerLabel}
      title={title}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values as z.output<TSchema>)
            setOpen(false)
            form.reset(values)
          })}
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
                    <FormControl>
                      {getFieldInput(field, controlledField)}
                    </FormControl>
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
    </BaseDialog>
  )
}
