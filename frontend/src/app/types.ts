/*
export interface AF {
  id: number
  numero: string
  fornecedor: string
  descricao?: string
  data_inicio: string
  data_fim: string
  status: boolean
}
*/
export interface APIResponse<T> {
  data: T[]
  totalRecords: number
  pageCount: number
  page: number
  pageSize: number
  orderBy: any[]
}
