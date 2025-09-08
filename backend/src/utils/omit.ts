export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const copy = { ...obj } as any
  for (const k of keys) delete copy[k]
  return copy
}
