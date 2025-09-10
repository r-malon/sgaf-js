'use client'

import useSWR, { SWRConfiguration } from 'swr'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { handleFetch } from '@/lib/handlers'

export function useAPISWR<T>(
  key: string | null,
  options?: SWRConfiguration<T[], any>,
) {
  const swr = useSWR<T[]>(key, key ? (url) => handleFetch<T[]>(url) : null, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    refreshInterval: 6000,
    dedupingInterval: 6000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    ...options,
  })

  useEffect(() => {
    if (swr.error) toast.error(swr.error.message)
  }, [swr.error])

  return swr
}
