import { PrismaClient } from '@prisma/client'

export async function getValorTotal(
  prisma: PrismaClient,
  valorId: number,
): Promise<number> {
  const valor = await prisma.valor.findUniqueOrThrow({
    where: { id: valorId },
    include: {
      af: { select: { data_inicio: true, data_fim: true } },
    },
  })

  const start = new Date(
    Math.max(valor.data_inicio.getTime(), valor.af.data_inicio.getTime()),
  )
  const end = valor.data_fim
    ? new Date(Math.min(valor.data_fim.getTime(), valor.af.data_fim.getTime()))
    : valor.af.data_fim

  if (start >= end) return 0

  const startMonth = start.getMonth()
  const startYear = start.getFullYear()
  const endMonth = end.getMonth()
  const endYear = end.getFullYear()

  if (startYear === endYear && startMonth === endMonth) {
    const daysInMonth = new Date(startYear, startMonth + 1, 0).getDate()
    const days = end.getDate() - start.getDate()
    return Math.round((valor.valor * days) / daysInMonth)
  }

  let total = 0

  // First partial month
  if (start.getDate() > 1) {
    const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate()
    const daysFromStart = daysInStartMonth - start.getDate() + 1
    total += Math.round((valor.valor * daysFromStart) / daysInStartMonth)
  }

  // Full months between
  const startMonthNum = startYear * 12 + startMonth
  const endMonthNum = endYear * 12 + endMonth

  for (let monthNum = startMonthNum + 1; monthNum < endMonthNum; monthNum++)
    total += valor.valor

  // Last partial month (if end is not first day of month)
  if (end.getDate() > 1) {
    const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate()
    const daysToEnd = end.getDate() - 1
    total += Math.round((valor.valor * daysToEnd) / daysInEndMonth)
  }

  return total
}
