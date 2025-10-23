import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(cents: number, symbol: boolean = true) {
  return new Intl.NumberFormat('pt-BR', {
    style: symbol ? 'currency' : 'decimal',
    currency: symbol ? 'BRL' : undefined,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)
}
