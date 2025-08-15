"use client"

import * as React from "react"
import { z, ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type FieldConfig = {
  name: string
  label: string
  type: "text" | "number" | "date" | "switch"
}

interface GenericDialogFormProps<TSchema extends ZodType<any, any>> {
  schema: TSchema
  defaultValues: z.infer<TSchema>
  fields: FieldConfig[]
  title: string
  triggerLabel: string
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
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const [open, setOpen] = React.useState(false)

  async function handleSubmit(values: z.infer<TSchema>) {
    await onSubmit(values)
    setOpen(false)
    form.reset(defaultValues)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "text" && (
                <Input id={field.name} {...form.register(field.name)} />
              )}
              {field.type === "number" && (
                <Input type="number" id={field.name} {...form.register(field.name)} />
              )}
              {field.type === "date" && (
                <Input type="date" id={field.name} {...form.register(field.name)} />
              )}
              {field.type === "switch" && (
                <Switch
                  id={field.name}
                  checked={form.watch(field.name) as unknown as boolean}
                  onCheckedChange={(checked) => form.setValue(field.name, checked as any)}
                />
              )}
            </div>
          ))}
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
