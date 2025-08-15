'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-hot-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { API_BASE_URL } from "@/lib/config"
import { cn } from "@/lib/utils"

const afSchema = z.object({
  numero: z.string().regex(/^\d+\/\d{4}$/, {
      message: "Número deve ter dígitos, barra e ano (ex: 123/2025)",
  }),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  descricao: z.string().trim().optional(),
  data_inicio: z.coerce.date({
    required_error: "Data de início é obrigatória",
    invalid_type_error: "Data de início inválida",
  }),
  data_fim: z.coerce.date({
    required_error: "Data de fim é obrigatória",
    invalid_type_error: "Data de fim inválida",
  }),
  status: z.boolean(),
}).refine((data) => data.data_fim >= data.data_inicio, {
  message: "Data de fim não pode ser anterior à data de início",
  path: ["data_fim"],
})

type AFFormData = z.infer<typeof afSchema>

interface AFDialogFormProps {
  af?: any
  onCreate: (af: any) => void
  onEdit: (af: any) => void
}

export function AFDialogForm({ af, onCreate, onEdit }: AFDialogFormProps) {
  const isEditMode = Boolean(af)

  const form = useForm<AFFormData>({
    resolver: zodResolver(afSchema),
    defaultValues: {
      numero: af?.numero ?? "",
      fornecedor: af?.fornecedor ?? "",
      descricao: af?.descricao ?? "",
      data_inicio: af ? af.data_inicio.slice(0, 10) : "",
      data_fim: af ? af.data_fim.slice(0, 10) : "",
      status: af?.status ?? true,
    },
  })

  async function onSubmit(values: AFFormData) {
    const payload = {
      ...values,
      id: af?.id ?? undefined,
    }

    try {
      if (isEditMode) {
        await handleEdit("af", "AF", payload as any)
      } else {
        await handleCreate("af", "AF", payload as any)
      }
      form.reset()
    } catch {
      // Errors are already shown in toast
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{isEditMode ? <Pencil className="h-4 w-4" /> : "Nova AF"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar AF" : "Nova AF"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              {...register("numero")}
              className={cn(errors.numero && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.numero && (
              <p className="text-sm text-red-500 mt-1">{errors.numero.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input
              id="fornecedor"
              {...register("fornecedor")}
              className={cn(errors.fornecedor && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.fornecedor && (
              <p className="text-sm text-red-500 mt-1">{errors.fornecedor.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              {...register("descricao")}
              className={cn(errors.descricao && "border-red-500 focus-visible:ring-red-500")}
            />
          </div>

          <div>
            <Label htmlFor="data_inicio">Início</Label>
            <Input
              id="data_inicio"
              type="date"
              required
              {...register("data_inicio")}
              className={cn(errors.data_inicio && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.data_inicio && (
              <p className="text-sm text-red-500 mt-1">{errors.data_inicio.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="data_fim">Fim</Label>
            <Input
              id="data_fim"
              type="date"
              required
              {...register("data_fim")}
              className={cn(errors.data_fim && "border-red-500 focus-visible:ring-red-500")}
            />
            {errors.data_fim && (
              <p className="text-sm text-red-500 mt-1">{errors.data_fim.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status">Ativo?</Label>
            <Switch
              id="status"
              checked={watch("status")}
              onCheckedChange={(checked) => setValue("status", checked)}
            />
          </div>

          <Button type="submit" className="w-full">{isEditMode ? "Salvar" : "Criar"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
