import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { getItemTotal } from './total.service'
import { countValoresForItem } from './valor-count.service'
import { type Item } from '@sgaf/shared'
import { omit } from '../utils/omit'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    return await this.prisma.$transaction(async (tx) => {
      const principal = await this.prisma.aF.findUniqueOrThrow({
        where: { id: createItemDto.principalId },
      })

      const item = await tx.item.create({
        data: {
          ...omit(createItemDto, ['valor']),
          data_alteracao: createItemDto.data_alteracao
            ? new Date(createItemDto.data_alteracao)
            : null,
        },
      })

      await tx.valor.create({
        data: {
          valor: createItemDto.valor,
          data_inicio: new Date(principal.data_inicio),
          data_fim: null,
          itemId: item.id,
          afId: createItemDto.principalId,
        },
      })

      return {
        ...omit(item, ['data_alteracao']),
        data_alteracao: item.data_alteracao
          ? item.data_alteracao.toISOString().slice(0, 10)
          : null,
        instalacoes: [],
        quantidade_total: 0,
        total: 0,
        valor_count: 1,
        instalados_count: 0,
      }
    })
  }

  async findOne(id: number, afId: number): Promise<Item | null> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: {
        instalacoes: {
          select: {
            id: true,
            localId: true,
            quantidade: true,
          },
        },
      },
    })

    return this.formatItem(item, afId)
  }

  async findManyByAf(afId: number): Promise<Item[]> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: afId },
      select: { principal: true },
    })

    const items = af.principal
      ? await this.prisma.item.findMany({
          where: { principalId: afId },
          include: {
            instalacoes: {
              select: {
                id: true,
                localId: true,
                quantidade: true,
              },
            },
          },
        })
      : await this.prisma.valor
          .findMany({
            where: { afId, data_fim: null },
            include: {
              item: {
                include: {
                  instalacoes: {
                    select: {
                      id: true,
                      localId: true,
                      quantidade: true,
                    },
                  },
                },
              },
            },
          })
          .then((valores) => valores.map((v) => v.item))

    return Promise.all(items.map((item) => this.formatItem(item, afId)))
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id },
      data: {
        descricao: updateItemDto.descricao,
        banda_maxima: updateItemDto.banda_maxima,
        quantidade_maxima: updateItemDto.quantidade_maxima,
        data_alteracao: updateItemDto.data_alteracao
          ? new Date(updateItemDto.data_alteracao)
          : null,
      },
      include: {
        instalacoes: {
          select: {
            id: true,
            localId: true,
            quantidade: true,
          },
        },
      },
    })

    return this.formatItem(item, item.principalId)
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({ where: { id } })
  }

  private async formatItem(
    item: {
      id: number
      principalId: number
      descricao: string | null
      data_alteracao: Date | null
      banda_maxima: number
      quantidade_maxima: number
      instalacoes: Array<{
        id: number
        localId: number
        quantidade: number
      }>
    },
    afId: number,
  ): Promise<Item> {
    const total = await getItemTotal(this.prisma, item.id, afId)
    const valor_count = await countValoresForItem(this.prisma, item.id, afId)
    const { instalacoes, ...rest } = item

    return {
      ...rest,
      data_alteracao: item.data_alteracao
        ? item.data_alteracao.toISOString().slice(0, 10)
        : null,
      instalacoes: instalacoes.map((i) => ({
        id: i.id,
        localId: i.localId,
        quantidade: i.quantidade,
      })),
      quantidade_total: instalacoes.reduce((sum, i) => sum + i.quantidade, 0),
      total,
      valor_count,
      instalados_count: instalacoes.length,
    }
  }
}
