"use client"

import { API_BASE_URL } from "@/lib/config"
import { useSWRConfig } from "swr"
import { toast } from "sonner"

function getCachedData(cache: ReturnType<typeof useSWRConfig>["cache"], key: string) {
  return cache.get(key)?.data
}

export function useEntityHandlers(entityName: string) {
  const { mutate, cache } = useSWRConfig()
  const url = `${API_BASE_URL}/${entityName.toLowerCase()}`

  async function handleCreate<T>(data: T) {
    const previous = getCachedData(cache, url)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      await mutate(url)
      toast.success(`${entityName} adicionado(a) com sucesso.`)
    } catch (error: any) {
      if (previous) mutate(url, previous, false)
      toast.error(`Erro ao criar ${entityName}: ${error.message}`)
      throw error
    }
  }

  async function handleEdit<T>(id: number, data: T) {
    const previous = getCachedData(cache, url)
    try {
      const res = await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      await mutate(url)
      toast.success(`${entityName} editado(a) com sucesso.`)
    } catch (error: any) {
      if (previous) mutate(url, previous, false)
      toast.error(`Erro ao atualizar ${entityName}: ${error.message}`)
      throw error
    }
  }

  async function handleDelete(id: number) {
    const previous = getCachedData(cache, url)
    try {
      const res = await fetch(`${url}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      await mutate(url)
      toast.success(`${entityName} deletado(a) com sucesso.`)
    } catch (error: any) {
      if (previous) mutate(url, previous, false)
      toast.error(`Erro ao remover ${entityName}: ${error.message}`)
      throw error
    }
  }

  return { handleCreate, handleEdit, handleDelete }
}
