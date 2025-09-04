import { differenceInCalendarDays, addMonths, addDays } from 'date-fns'
import { Valor } from '@sgaf/shared'

export function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

export function prorateTotal(
  afStart: Date,
  afEnd: Date,
  valores: Valor[],
): number {
  valores = [...valores].sort(
    (a, b) => a.data_inicio.getTime() - b.data_inicio.getTime(),
  )

  const effectiveAfEnd = addDays(afEnd, 1) // Treat as exclusive end

  const changePoints = new Set<Date>([afStart, effectiveAfEnd])
  valores.forEach((v) => {
    changePoints.add(v.data_inicio)
    if (v.data_fim) changePoints.add(addDays(v.data_fim, 1)) // Exclusive
  })

  let current = new Date(afStart.getFullYear(), afStart.getMonth(), 1)
  while (current < effectiveAfEnd) {
    changePoints.add(current)
    current = addMonths(current, 1)
  }

  const timeline = Array.from(changePoints).sort(
    (a, b) => a.getTime() - b.getTime(),
  )

  let total = 0
  for (let i = 0; i < timeline.length - 1; i++) {
    const segStart = timeline[i]
    const segEnd = timeline[i + 1]
    if (segStart >= segEnd) continue

    const segStartActual = new Date(
      Math.max(segStart.getTime(), afStart.getTime()),
    )
    const segEndActual = new Date(
      Math.min(segEnd.getTime(), effectiveAfEnd.getTime()),
    )
    if (segStartActual >= segEndActual) continue

    let activeValor: number | null = null
    for (const v of valores) {
      const vEnd = v.data_fim ? addDays(v.data_fim, 1) : effectiveAfEnd
      if (v.data_inicio <= segStartActual && segStartActual < vEnd) {
        activeValor = v.valor
        break
      }
    }

    if (activeValor === null) continue

    const days = differenceInCalendarDays(segEndActual, segStartActual)
    const monthDays = daysInMonth(segStartActual)
    const dailyRate = activeValor / 100 / monthDays
    const prorated = days * dailyRate
    total += prorated
  }

  return Math.round(total * 100)
}
