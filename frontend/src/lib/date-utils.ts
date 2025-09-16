export function toUTCMidnightString(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const utc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  return utc.toISOString() // always UTC midnight
}

export const formatDateToInput = (
  dateInput: string | number | Date | null | undefined,
): string => {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0] // Always YYYY-MM-DD (assumes UTC)
}
