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

  const startDay = start.getDate()
  const startMonth = start.getMonth()
  const startYear = start.getFullYear()
  const endDay = end.getDate()
  const endMonth = end.getMonth()
  const endYear = end.getFullYear()

  const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate()
  const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate()

  if (startYear === endYear && startMonth === endMonth) {
    const days = endDay - startDay + 1
    return Math.round((valor.valor * days) / daysInStartMonth)
  }

  let total = 0

  // First partial month
  if (startDay > 1) {
    const daysFromStart = daysInStartMonth - startDay + 1
    total += Math.round((valor.valor * daysFromStart) / daysInStartMonth)
  }

  // Full months between
  const startMonthNum = startYear * 12 + startMonth
  const endMonthNum = endYear * 12 + endMonth
  const startLoop = startDay === 1 ? startMonthNum : startMonthNum + 1
  const endLoop = endDay === daysInEndMonth ? endMonthNum : endMonthNum - 1

  for (let monthNum = startLoop; monthNum <= endLoop; monthNum++)
    total += valor.valor

  // Last partial month (if end is not on last day of month)
  if (endDay < daysInEndMonth)
    total += Math.round((valor.valor * endDay) / daysInEndMonth)

  return total
}
