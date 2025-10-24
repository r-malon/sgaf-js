'use client'

import { useParams } from 'next/navigation'
import { useAPISWR } from '@/lib/hooks'
import { useEntityHandlers } from '@/lib/handlers'
import { formatBRL, formatDate, formatMonth, overlaps } from '@/lib/utils'
import { type AF, type Contrato, type Item, type Instalacao, type Valor } from '@sgaf/shared'

function calculatePrice(
  valor: number,
  quantidade: number,
  bandaInstalada: number,
  bandaMaxima: number,
  dataInstalacao: string,
  dataDesinstalacao: string | null,
  mesInicio: Date,
  mesFim: Date,
) {
  const inicio = new Date(dataInstalacao)
  const fim = dataDesinstalacao ? new Date(dataDesinstalacao) : mesFim

  const efetivo_inicio = inicio > mesInicio ? inicio : mesInicio
  const efetivo_fim = fim < mesFim ? fim : mesFim

  if (efetivo_inicio > efetivo_fim) return 0

  const dias = efetivo_fim.getDate() - efetivo_inicio.getDate() + 1
  const bandaRatio = bandaMaxima > 0 ? bandaInstalada / bandaMaxima : 1

  return Math.round((valor * quantidade * bandaRatio * dias) / 30)
}

export default function Bordereau() {
  const params = useParams()
  const afId = Number(params.id)
  const ano = Number(params.ano)
  const mes = Number(params.mes)

  const mesInicio = new Date(ano, mes - 1, 1)
  const mesFim = new Date(ano, mes, 0)

  const afHandlers = useEntityHandlers('af')
  const contratoHandlers = useEntityHandlers('contrato')
  const itemHandlers = useEntityHandlers('item')
  const valorHandlers = useEntityHandlers('valor')
  const instalacaoHandlers = useEntityHandlers('instalacao')

  const { data: af, isLoading: afLoading, error: afError } = useAPISWR<AF>(`${afHandlers.baseURL}/${afId}`)
  const { data: contrato, isLoading: contratoLoading, error: contratoError } = useAPISWR<Contrato>(
    af ? `${contratoHandlers.baseURL}/${af.contratoId}` : null
  )
  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useAPISWR<Item>(itemHandlers.key({ afId }))
  const { data: valores = [], isLoading: valoresLoading, error: valoresError } = useAPISWR<Valor>(valorHandlers.key({ afId }))
  const { data: allInstalacoes = [], isLoading: instalacoesLoading, error: instalacoesError } = useAPISWR<Instalacao>(instalacaoHandlers.key())

  const loading = afLoading || contratoLoading || itemsLoading || valoresLoading || instalacoesLoading
  const error = afError || contratoError || itemsError || valoresError || instalacoesError

  if (loading) return <div className="p-8">Carregando...</div>
  if (error) return <div className="p-8 text-red-500">Erro: {error.message}</div>
  if (!af || !contrato) return <div className="p-8">Dados não encontrados</div>

  // Build valor lookup by itemId
  const valoresPorItem = new Map<number, Valor[]>()
  for (const v of valores) {
    if (!valoresPorItem.has(v.itemId)) valoresPorItem.set(v.itemId, [])
    valoresPorItem.get(v.itemId)!.push(v)
  }

  // Build instalacoes lookup by itemId
  const instalacoesPorItem = new Map<number, Instalacao[]>()
  for (const inst of allInstalacoes) {
    if (!instalacoesPorItem.has(inst.itemId)) instalacoesPorItem.set(inst.itemId, [])
    instalacoesPorItem.get(inst.itemId)!.push(inst)
  }

  // Filter and calculate
  const itemsAtivos = items.filter((item) => {
    const vals = valoresPorItem.get(item.id) ?? []
    const hasValorAtivo = vals.some((v) =>
      overlaps(
        new Date(v.data_inicio),
        v.data_fim ? new Date(v.data_fim) : null,
        mesInicio,
        mesFim
      )
    )
    const insts = instalacoesPorItem.get(item.id) ?? []
    const hasInstalacaoAtiva = insts.some((i) =>
      overlaps(
        new Date(i.data_instalacao),
        i.data_desinstalacao ? new Date(i.data_desinstalacao) : null,
        mesInicio,
        mesFim
      )
    )
    return hasValorAtivo && hasInstalacaoAtiva
  })

  if (itemsAtivos.length === 0) {
    return (
      <div className="p-8">
        Nenhuma instalação ativa em {formatMonth(ano, mes)}.
      </div>
    )
  }

  let totalGeral = 0

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

      {itemsAtivos.map((item) => {
        const vals = valoresPorItem.get(item.id) ?? []
        const valsAtivos = vals.filter((v) =>
          overlaps(
            new Date(v.data_inicio),
            v.data_fim ? new Date(v.data_fim) : null,
            mesInicio,
            mesFim
          )
        )
        
        // Get most recent valor
        const valorAtivo = valsAtivos.sort(
          (a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
        )[0]

        const insts = instalacoesPorItem.get(item.id) ?? []
        const instsAtivas = insts.filter((i) =>
          overlaps(
            new Date(i.data_instalacao),
            i.data_desinstalacao ? new Date(i.data_desinstalacao) : null,
            mesInicio,
            mesFim
          )
        )

        const qtdUsada = instsAtivas.reduce((sum, i) => sum + i.quantidade, 0)
        let totalItem = 0

        return (
          <section key={item.id} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {item.descricao ?? 'Sem descrição'}
            </h3>
            <p className="text-sm mb-1">
              <strong>Banda Máxima:</strong> {item.banda_maxima}
            </p>
            <p className="text-sm mb-1">
              <strong>Qtd.: </strong>
              {qtdUsada} / {item.quantidade_maxima}
            </p>

            <table className="w-full border-collapse text-sm mb-2">
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
                {instsAtivas.map((inst, idx) => {
                  const preco = calculatePrice(
                    valorAtivo.valor,
                    inst.quantidade,
                    inst.banda_instalada,
                    item.banda_maxima,
                    inst.data_instalacao,
                    inst.data_desinstalacao,
                    mesInicio,
                    mesFim
                  )
                  totalItem += preco

                  return (
                    <tr key={inst.id} className={idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border px-2 py-1">{inst.local?.nome}</td>
                      <td className="border px-2 py-1 text-center">
                        {inst.banda_instalada}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {inst.quantidade}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {formatDate(inst.data_instalacao)}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {inst.data_desinstalacao ? formatDate(inst.data_desinstalacao) : '⸻'}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {formatBRL(preco)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <p className="text-sm font-medium text-right">
              <strong>Total:</strong> {formatBRL(totalItem)}
            </p>
            
            {/* Hidden counter for grand total */}
            <span className="hidden">{totalGeral += totalItem}</span>
          </section>
        )
      })}

      <footer className="mt-8 border-t pt-4">
        <p className="text-lg font-semibold">
          <strong>Valor total:</strong> {formatBRL(totalGeral)}
        </p>
      </footer>
    </div>
  )
}
