export function toUTCMidnightString(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  const utc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  return utc.toISOString() // always UTC midnight
}
