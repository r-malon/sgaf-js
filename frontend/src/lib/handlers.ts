'use client'

import { API_BASE_URL } from '@/lib/config'
import { useSWRConfig } from 'swr'
import { toast } from 'sonner'

function getCachedData<T>(
  cache: ReturnType<typeof useSWRConfig>['cache'],
  key: string,
): T | undefined {
  return cache.get(key)?.data as T | undefined
}

export async function handleFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, options)
  } catch (err: any) {
    toast.error('Network error', {
      description: err?.message ?? 'Failed to connect to server',
    })
    throw err
  }

  let data: any = null
  try {
    const text = await res.text()
    if (text) data = JSON.parse(text)
  } catch {
    // ignore non-JSON bodies
  }

  if (!res.ok) {
    toast.error(`HTTP ${res.status} ${res.statusText}`, {
      description: data?.message ?? 'Erro inesperado',
    })
    throw new Error(
      `HTTP ${data?.statusCode ?? res.status}: ${
        data?.message ?? res.statusText
      }`,
    )
  }

  return data as T
}

export function useEntityHandlers(entityName: string) {
  const { mutate, cache } = useSWRConfig()
  const baseURL = `${API_BASE_URL}/${entityName}`

  const key = (query?: Record<string, any>) => {
    if (!query) return baseURL
    const params = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)]),
    )
    return `${baseURL}?${params.toString()}`
  }

  async function revalidateAllEntityKeys() {
    for (const k of cache.keys()) {
      if (typeof k === 'string' && k.startsWith(baseURL)) {
        await mutate(k)
      }
    }
  }

  async function doRequest<T>(
    path: string,
    options: RequestInit,
    successMsg: string,
  ) {
    const previous = getCachedData<T[]>(cache, path)
    try {
      await handleFetch(path, options)
      await revalidateAllEntityKeys() // refresh all related queries
      toast.success(successMsg)
    } catch {
      if (previous) mutate(path, previous, false)
    }
  }

  async function handleFetchEntities<T>(
    query?: Record<string, any>,
  ): Promise<T[]> {
    return handleFetch<T[]>(key(query))
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
      { method: 'DELETE' },
      `${entityName} removido(a) com sucesso.`,
    )
  }

  return {
    baseURL,
    key,
    handleFetch: handleFetchEntities,
    handleCreate,
    handleEdit,
    handleDelete,
  }
}
