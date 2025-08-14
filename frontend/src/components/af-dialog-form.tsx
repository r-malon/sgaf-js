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

const afSchema = z.object({
  numero: z.number().min(1, "Número é obrigatório e positivo"),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  descricao: z.string().optional(),
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
  } = useForm<AFFormData>({
    resolver: zodResolver(afSchema),
    defaultValues: {
      numero: 0,
      fornecedor: '',
      descricao: '',
      data_inicio: new Date(),
      data_fim: new Date(),
      status: true,
    },
  })

  const onSubmit = async (data: AFFormData) => {
    try {
      const response = await axios.post("/af", data)

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
              type="number"
              min="0"
              {...register("numero", { valueAsNumber: true })}
            />
            {errors.numero && (
              <p className="text-sm text-red-500 mt-1">{errors.numero.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="fornecedor">Fornecedor</Label>
            <Input id="fornecedor" {...register("fornecedor")} />
            {errors.fornecedor && (
              <p className="text-sm text-red-500 mt-1">{errors.fornecedor.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" {...register("descricao")} />
          </div>

          <div>
            <Label htmlFor="data_inicio">Início</Label>
            <Input id="data_inicio" type="date" {...register("data_inicio")} />
            {errors.data_inicio && (
              <p className="text-sm text-red-500 mt-1">{errors.data_inicio.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="data_fim">Fim</Label>
            <Input id="data_fim" type="date" {...register("data_fim")} />
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
