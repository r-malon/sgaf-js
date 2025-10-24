'use client'

import { useParams } from 'next/navigation'
import { useAPISWR } from '@/lib/hooks'
import { useEntityHandlers } from '@/lib/handlers'
import {
  formatBRL,
  formatDate,
  formatMonth,
  capitalize,
  overlaps,
} from '@/lib/utils'
import {
  type AF,
  type Contrato,
  type Item,
  type Instalacao,
  type Valor,
} from '@sgaf/shared'

export default function Bordereau() {
  const params = useParams()
  const afId = Number(params.id),
    ano = Number(params.ano),
    mes = Number(params.mes)

  const inicio_mes = new Date(ano, mes - 1, 1)
  const fim_mes = new Date(ano, mes, 0)

  const afHandlers = useEntityHandlers('af')
  const contratoHandlers = useEntityHandlers('contrato')
  const itemHandlers = useEntityHandlers('item')
  const instalacaoHandlers = useEntityHandlers('instalacao')
  const valorHandlers = useEntityHandlers('valor')

  const afSwr = useAPISWR<AF>(`${afHandlers.baseURL}/${afId}`)
  const contratoSwr = useAPISWR<Contrato>(
    afSwr.data ? `${contratoHandlers.baseURL}/${afSwr.data.contratoId}` : null,
  )
  const itemsSwr = useAPISWR<Item>(itemHandlers.key({ afId }))
  const valoresSwr = useAPISWR<Valor>(valorHandlers.key({ itemId: 1, afId }))
  const instalacoesSwr = useAPISWR<Instalacao>(instalacaoHandlers.key())

  const isLoading =
    afSwr.isLoading ||
    contratoSwr.isLoading ||
    valoresSwr.isLoading ||
    itemsSwr.isLoading ||
    instalacoesSwr.isLoading
  const err =
    afSwr.error ||
    contratoSwr.error ||
    valoresSwr.error ||
    itemsSwr.error ||
    instalacoesSwr.error

  if (isLoading) return <div className="p-8">Carregando...</div>

  if (err) return <div className="p-8 text-red-500">Erro: {err.message}</div>

  const af = afSwr.data
  const contrato = contratoSwr.data
  const valores = valoresSwr.data ?? []
  const items = itemsSwr.data ?? []
  const instalacoes = instalacoesSwr.data ?? []

  // Process data
  const valoresByItem = new Map<number, Valor[]>()
  for (const v of valores) {
    if (!valoresByItem.has(v.itemId)) valoresByItem.set(v.itemId, [])
    valoresByItem.get(v.itemId)!.push(v)
  }

  const itemData: Array<{
    id: number
    descricao: string | null
    banda_maxima: number
    quantidade_maxima: number
    quantidade_usada: number
    total: number
    instalacoes: Array<{
      local: { nome: string }
      banda_instalada: number
      quantidade: number
      data_instalacao: string
      data_desinstalacao: string | null
      total_price: number
    }>
  }> = []

  for (const [itemId, vs] of valoresByItem.entries()) {
    const overlapping = vs.filter((v) =>
      overlaps(
        new Date(v.data_inicio),
        v.data_fim ? new Date(v.data_fim) : null,
        inicio_mes,
        fim_mes,
      ),
    )
    if (overlapping.length === 0) continue

    const sorted = [...overlapping].sort(
      (a, b) =>
        new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime(),
    )
    const valor_unitario = sorted[0].valor

    const item = items.find((i) => i.id === itemId)
    if (!item) continue

    const itemInstalacoes = instalacoes.filter((i) => i.itemId === itemId)
    const activeInstalacoes = itemInstalacoes.filter((i) =>
      overlaps(
        new Date(i.data_instalacao),
        i.data_desinstalacao ? new Date(i.data_desinstalacao) : null,
        inicio_mes,
        fim_mes,
      ),
    )
    if (activeInstalacoes.length === 0) continue

    let quantidade_usada = 0
    let total = 0
    const enhancedInstalacoes = activeInstalacoes.map((i) => {
      const total_price =
        valor_unitario * i.quantidade * (i.banda_instalada / item.banda_maxima)
      quantidade_usada += i.quantidade
      total += total_price
      return { ...i, total_price }
    })

    itemData.push({
      id: item.id,
      descricao: item.descricao,
      banda_maxima: item.banda_maxima,
      quantidade_maxima: item.quantidade_maxima,
      quantidade_usada,
      total,
      instalacoes: enhancedInstalacoes,
    })
  }

  const total_geral = itemData.reduce((sum, d) => sum + d.total, 0)

  if (itemData.length === 0)
    return (
      <div className="p-8">
        Nenhuma instalação ativa em {formatMonth(ano, mes)}.
      </div>
    )

  return (
    <div className="p-8 print:p-0 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Bordereau</h1>
        <p className="text-sm">
          <strong>Fornecedor:</strong> {contrato.fornecedor}
        </p>
        <p className="text-sm">
          <strong>CPF/CNPJ:</strong> {contrato.cpf}
        </p>
        <p className="text-sm">
          <strong>Contrato:</strong> {contrato.numero}
        </p>
        <p className="text-sm">
          <strong>AF:</strong> {af.numero}
        </p>
        <p className="text-sm">
          <strong>Período:</strong> {formatMonth(ano, mes)}
        </p>
      </header>

      {itemData.map((item) => (
        <section key={item.id} className="mb-6">
          <h3 className="text-lg font-medium mb-2">
            {item.descricao ?? 'Sem descrição'}
          </h3>
          <p className="text-sm mb-1">
            <strong>Banda Máxima:</strong> {item.banda_maxima}
          </p>
          <p className="text-sm mb-1">
            <strong>Qtd.: </strong>
            {item.quantidade_usada} / {item.quantidade_maxima}
          </p>
          <p className="text-sm mb-2">
            <strong>Total:</strong> {formatBRL(item.total)}
          </p>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Local</th>
                <th className="border px-2 py-1">Banda Instalada</th>
                <th className="border px-2 py-1">Quantidade</th>
                <th className="border px-2 py-1">Instalação</th>
                <th className="border px-2 py-1">Desinstalação</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {item.instalacoes.map((i, idx) => (
                <tr key={idx} className={idx % 2 ? 'bg-gray' : 'bg-white'}>
                  <td className="border px-2 py-1">{i.local?.nome}</td>
                  <td className="border px-2 py-1 text-center">
                    {i.banda_instalada}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {i.quantidade}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {formatDate(i.data_instalacao)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {i.data_desinstalacao
                      ? formatDate(i.data_desinstalacao)
                      : '⸻'}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {formatBRL(i.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <footer className="mt-8 border-t pt-4">
        <p className="text-lg font-semibold">
          <strong>Valor total:</strong> {formatBRL(total_geral)}
        </p>
      </footer>
    </div>
  )
}
