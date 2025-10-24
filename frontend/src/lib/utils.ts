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

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export function formatMonth(year?: number, month: number) {
  const date = new Date(year ?? 0, month - 1, 1)
  return capitalize(
    date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
  )
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function overlaps(
  start: Date,
  end: Date | null,
  inicio: Date,
  fim: Date,
): boolean {
  return start <= fim && (end === null || end >= inicio)
}
