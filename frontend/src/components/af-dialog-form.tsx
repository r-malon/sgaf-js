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

export function AFDialogForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AFFormData>({
    resolver: zodResolver(afSchema),
    defaultValues: {
      numero: "",
      fornecedor: "",
      descricao: "",
      data_inicio: null,
      data_fim: null,
      status: true,
    },
    mode: "onBlur",
  })

  const onSubmit = async (data: AFFormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/af`, data)

      if (response.status === 201) {
        toast.success("AF criada com sucesso!")
        reset()
      } else {
        toast.error("Falha ao criar AF!")
      }
    } catch (error) {
      toast.error("Erro ao enviar dados!")
      console.error("Error submitting data:", error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nova AF</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar nova AF</DialogTitle>
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

          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
