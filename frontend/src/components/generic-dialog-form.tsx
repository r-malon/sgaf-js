"use client"

import * as React from "react"
import { z, ZodType } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

export type FieldConfig =
  | { name: string; label: string; type: "text"; description?: string }
  | { name: string; label: string; type: "textarea"; description?: string }
  | { name: string; label: string; type: "date"; description?: string }
  | { name: string; label: string; type: "switch"; description?: string }

interface GenericDialogFormProps<TSchema extends ZodType<any, any>> {
  schema: TSchema
  defaultValues: z.infer<TSchema>
  fields: FieldConfig[]
  title: React.ReactElement | string
  triggerLabel: React.ReactElement | string
  onSubmit: (values: z.infer<TSchema>) => Promise<void>
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

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  })

  const handleSubmit = async (values: z.infer<TSchema>) => {
    await onSubmit(values)
    setOpen(false)
    form.reset(defaultValues)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: controlledField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    {(() => {
                      let controlEl: React.ReactElement
                      switch (field.type) {
                        case "text":
                          controlEl = <Input {...controlledField} />
                          break
                        case "textarea":
                          controlEl = <Textarea {...controlledField} />
                          break
                        case "date":
                          controlEl = <Input type="date" {...controlledField} />
                          break
                        case "switch":
                          controlEl = (
                            <Switch
                              checked={Boolean(controlledField.value)}
                              onCheckedChange={controlledField.onChange}
                            />
                          )
                          break
                        default:
                          throw new Error(
                            `Unsupported field type "${field.type}" in GenericDialogForm`
                          )
                      }
                      return <FormControl>{controlEl}</FormControl>
                    })()}

                    {field.description && (
                      <FormDescription>{field.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full">
              Salvar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
