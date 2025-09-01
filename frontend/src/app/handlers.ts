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

  const text = await res.text()
  if (text) data = JSON.parse(text)

  if (!res.ok) {
    toast.error(`HTTP ${res.status} ${res.statusText}`, { description: (data as any)?.message })
    throw new Error(`HTTP ${(data as any)?.statusCode}: ${(data as any)?.message}`)
  }

  return data as T
}

export function useEntityHandlers(entityName: string) {
  const { mutate, cache } = useSWRConfig()
  const baseUrl = `${API_BASE_URL}/${entityName.toLowerCase()}`

  async function doRequest<T>(path: string, options: RequestInit, successMsg: string) {
    const previous = getCachedData(cache, baseUrl)
    try {
      await handleFetch(path, options)
      await mutate(baseUrl)
      toast.success(successMsg)
    } catch {
      if (previous) mutate(baseUrl, previous, false)
    }
  }

  async function handleFetchEntities<T>(query?: Record<string, any>): Promise<T[]> {
    const params = query
      ? "?" +
        new URLSearchParams(
          Object.entries(query).map(([k, v]) => [k, String(v)])
        ).toString()
      : ""
    return handleFetch<T[]>(`${baseUrl}${params}`)
  }

  async function handleCreate<T>(data: T) {
    return doRequest(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }, `${entityName} adicionado(a) com sucesso.`)
  }

  async function handleEdit<T>(id: number, data: T) {
    return doRequest(`${baseUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }, `${entityName} editado(a) com sucesso.`)
  }

  async function handleDelete(id: number) {
    return doRequest(`${baseUrl}/${id}`, {
      method: "DELETE",
    }, `${entityName} removido(a) com sucesso.`)
  }

  return { baseUrl, handleFetch: handleFetchEntities, handleCreate, handleEdit, handleDelete }
}
