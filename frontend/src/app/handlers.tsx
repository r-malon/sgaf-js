"use client"

import { API_BASE_URL } from "@/lib/config"
import { mutate } from "swr"
import { toast } from "react-hot-toast"

type Entity = Record<string, any>

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (data?.message) return Array.isArray(data.message) ? data.message.join(", ") : data.message
  } catch {}
  return `Erro HTTP ${res.status}`
}

export async function handleCreate<T extends Entity>(resource: string, entityName: string, newEntity: T) {
  const url = `${API_BASE_URL}/${resource}`
  const previous = await mutate(url, undefined, false)

  mutate(url, (current: T[] = []) => [...current, newEntity], false)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntity),
    })
    if (!res.ok) throw new Error(await extractErrorMessage(res))
    const created = await res.json()
    toast({ title: `${entityName} criado(a)`, description: `${entityName} adicionado(a) com sucesso.` })
    mutate(url)
    return created
  } catch (error: any) {
    toast({ title: `Erro ao criar ${entityName}`, description: error.message, variant: "destructive" })
    mutate(url, previous, false)
    throw error
  }
}

export async function handleEdit<T extends Entity>(
  resource: string,
  entityName: string,
  updatedEntity: T & { id: string | number }
) {
  const url = `${API_BASE_URL}/${resource}`
  const previous = await mutate(url, undefined, false)

  // Optimistic update
  mutate(
    url,
    (current: T[] = []) =>
      current.map((item) => (item.id === updatedEntity.id ? updatedEntity : item)),
    false
  )

  try {
    const res = await fetch(`${url}/${updatedEntity.id}`, {
      method: "PATCH", // ← PATCH instead of PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEntity),
    })
    if (!res.ok) throw new Error(await extractErrorMessage(res))
    const updated = await res.json()
    toast({
      title: `${entityName} atualizado(a)`,
      description: `${entityName} alterado(a) com sucesso.`,
    })
    mutate(url)
    return updated
  } catch (error: any) {
    toast({
      title: `Erro ao atualizar ${entityName}`,
      description: error.message,
      variant: "destructive",
    })
    mutate(url, previous, false)
    throw error
  }
}

export async function handleDelete(resource: string, entityName: string, id: string | number) {
  const url = `${API_BASE_URL}/${resource}`
  const previous = await mutate(url, undefined, false)

  mutate(url, (current: Entity[] = []) => current.filter((item) => item.id !== id), false)

  try {
    const res = await fetch(`${url}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error(await extractErrorMessage(res))
    toast({ title: `${entityName} excluído(a)`, description: `${entityName} removido(a) com sucesso.` })
    mutate(url)
  } catch (error: any) {
    toast({ title: `Erro ao excluir ${entityName}`, description: error.message, variant: "destructive" })
    mutate(url, previous, false)
    throw error
  }
}
