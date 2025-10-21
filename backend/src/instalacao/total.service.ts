import { PrismaClient } from '@prisma/client'

export async function getInstalacaoTotal(
  prisma: PrismaClient,
  instalacaoId: number,
): Promise<number> {
  const instalacao = await prisma.instalacao.findUniqueOrThrow({
    where: { id: instalacaoId },
    include: {
      item: {
        include: {
          principal: { select: { data_inicio: true, data_fim: true } },
        },
      },
    },
  })

  const start = new Date(instalacao.data_instalacao)
  const end = instalacao.data_desinstalacao
    ? new Date(instalacao.data_desinstalacao)
    : new Date(instalacao.item.principal.data_fim)

  if (start >= end) return 0

  const startDay = start.getDate()
  const startMonth = start.getMonth()
  const startYear = start.getFullYear()
  const endDay = end.getDate()
  const endMonth = end.getMonth()
  const endYear = end.getFullYear()

  const bandaRatio =
    instalacao.item.banda_maxima > 0
      ? instalacao.banda_instalada / instalacao.item.banda_maxima
      : 1

  if (startYear === endYear && startMonth === endMonth) {
    const days = endDay - startDay + 1
    const valor = await getValorForDate(prisma, instalacao.itemId, start)
    if (!valor) return 0
    return Math.round((valor * instalacao.quantidade * bandaRatio * days) / 30)
  }

  let total = 0

  // First partial month
  if (startDay > 1) {
    const daysFromStart = 30 - startDay + 1
    const valor = await getValorForDate(prisma, instalacao.itemId, start)
    total += Math.round(
      (valor * instalacao.quantidade * bandaRatio * daysFromStart) / 30,
    )
  }

  // Full months between
  const startMonthNum = startYear * 12 + startMonth
  const endMonthNum = endYear * 12 + endMonth
  const startLoop = startDay === 1 ? startMonthNum : startMonthNum + 1
  const endLoop = endDay === 30 ? endMonthNum : endMonthNum - 1

  for (let monthNum = startLoop; monthNum <= endLoop; monthNum++) {
    const m = monthNum % 12
    const y = Math.floor(monthNum / 12)
    const monthStart = new Date(y, m, 1)
    const valor = await getValorForDate(prisma, instalacao.itemId, monthStart)
    total += Math.round(valor * instalacao.quantidade * bandaRatio)
  }

  // Last partial month
  if (endDay < 30) {
    const monthStart = new Date(endYear, endMonth, 1)
    const valor = await getValorForDate(prisma, instalacao.itemId, monthStart)
    total += Math.round(
      (valor * instalacao.quantidade * bandaRatio * endDay) / 30,
    )
  }

  return total
}

async function getValorForDate(
  prisma: PrismaClient,
  itemId: number,
  date: Date,
): Promise<number> {
  const valor = await prisma.valor.findFirstOrThrow({
    where: {
      itemId,
      data_inicio: { lte: date },
      OR: [{ data_fim: null }, { data_fim: { gte: date } }],
    },
  })

  return valor.valor
}
