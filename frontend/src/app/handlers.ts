'use client'

import { API_BASE_URL } from '@/lib/config'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'

function getCachedData(
  cache: ReturnType<typeof useSWRConfig>['cache'],
  key: string,
) {
  return cache.get(key)?.data
}

export async function handleFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options)
  let data: T | null = null

  const text = await res.text()
  if (text) data = JSON.parse(text)

  if (!res.ok) {
    toast.error(`HTTP ${res.status} ${res.statusText}`, {
      description: (data as any)?.message,
    })
    throw new Error(
      `HTTP ${(data as any)?.statusCode}: ${(data as any)?.message}`,
    )
  }

  return data as T
}

export function useEntityHandlers(entityName: string) {
  const { mutate, cache } = useSWRConfig()
  const baseURL = `${API_BASE_URL}/${entityName.toLowerCase()}`

  async function doRequest<T>(
    path: string,
    options: RequestInit,
    successMsg: string,
  ) {
    const previous = getCachedData(cache, baseURL)
    try {
      await handleFetch(path, options)
      await mutate(baseURL)
      toast.success(successMsg)
    } catch {
      if (previous) mutate(baseURL, previous, false)
    }
  }

  async function handleFetchEntities<T>(
    query?: Record<string, any>,
  ): Promise<T[]> {
    const params = query
      ? '?' +
        new URLSearchParams(
          Object.entries(query).map(([k, v]) => [k, String(v)]),
        ).toString()
      : ''
    return handleFetch<T[]>(`${baseURL}${params}`)
  }

  async function handleCreate<T>(data: T) {
    return doRequest(
      baseURL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      `${entityName} adicionado(a) com sucesso.`,
    )
  }

  async function handleEdit<T>(id: number, data: T) {
    return doRequest(
      `${baseURL}/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      `${entityName} editado(a) com sucesso.`,
    )
  }

  async function handleDelete(id: number) {
    return doRequest(
      `${baseURL}/${id}`,
      {
        method: 'DELETE',
      },
      `${entityName} removido(a) com sucesso.`,
    )
  }

  return {
    baseURL,
    handleFetch: handleFetchEntities,
    handleCreate,
    handleEdit,
    handleDelete,
  }
}
