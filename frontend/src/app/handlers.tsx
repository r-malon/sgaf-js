"use client"

import { API_BASE_URL } from "@/lib/config"
import { useSWRConfig } from "swr"
import { toast } from "sonner"

function getCachedData(cache: ReturnType<typeof useSWRConfig>["cache"], key: string) {
  return cache.get(key)?.data
}

export async function handleFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  let data: T | null = null

  // DELETE response usually empty
  const text = await res.text()
  if (text)
    data = JSON.parse(text)

  if (!res.ok) {
    toast.error(`HTTP ${res.status} ${res.statusText}`, { description: data.message })
    throw new Error(`HTTP ${data.statusCode}: ${data.message}`)
  }

  return data
}

export function useEntityHandlers(entityName: string) {
  const { mutate, cache } = useSWRConfig()
  const url = `${API_BASE_URL}/${entityName.toLowerCase()}`

  async function doRequest<T>(path: string, options: RequestInit, successMsg: string) {
    const previous = getCachedData(cache, url)
    try {
      await handleFetch(path, options)
      await mutate(url)
      toast.success(successMsg)
    } catch (error: any) {
      if (previous)
        mutate(url, previous, false)
    }
  }

  async function handleCreate<T>(data: T) {
    return doRequest(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }, `${entityName} adicionado(a) com sucesso.`)
  }

  async function handleEdit<T>(id: number, data: T) {
    return doRequest(`${url}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }, `${entityName} editado(a) com sucesso.`)
  }

  async function handleDelete(id: number) {
    return doRequest(`${url}/${id}`, {
      method: "DELETE",
    }, `${entityName} removido(a) com sucesso.`)
  }

  return { handleCreate, handleEdit, handleDelete }
}
