import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { countValoresForItem } from './valor-count.service'
import { type Item } from '@sgaf/shared'
import { omit } from '../utils/omit'
import {
  Item as PrismaItem,
  Instalacao as PrismaInstalacao,
} from '@prisma/client'

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
        ...item,
        instalacoes: [],
        quantidade_usada: 0,
        valor_count: 1,
        instalados_count: 0,
      }
    })
  }

  async findOne(id: number, afId: number): Promise<Item> {
    const item = await this.prisma.item.findUniqueOrThrow({
      where: { id },
      include: { instalacoes: true },
    })

    return this.format(item, afId)
  }

  async findManyByAf(afId: number): Promise<Item[]> {
    const af = await this.prisma.aF.findUniqueOrThrow({
      where: { id: afId },
      select: { principal: true },
    })

    const items = af.principal
      ? await this.prisma.item.findMany({
          where: { principalId: afId },
          include: { instalacoes: true },
        })
      : await this.prisma.valor
          .findMany({
            where: { afId, data_fim: null },
            include: {
              item: { include: { instalacoes: true } },
            },
          })
          .then((valores) => valores.map((v) => v.item))

    return Promise.all(items.map((item) => this.format(item, afId)))
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.prisma.item.update({
      where: { id },
      data: {
        descricao: updateItemDto.descricao,
        banda_maxima: updateItemDto.banda_maxima,
        quantidade_maxima: updateItemDto.quantidade_maxima,
      },
      include: { instalacoes: true },
    })

    return this.format(item, item.principalId)
  }

  async delete(id: number): Promise<void> {
    await this.prisma.item.delete({ where: { id } })
  }

  private async format(
    item: PrismaItem & { instalacoes: PrismaInstalacao[] },
    afId: number,
  ): Promise<Item> {
    const valor_count = await countValoresForItem(this.prisma, item.id, afId)
    const { instalacoes, ...rest } = item

    return {
      ...rest,
      instalacoes: instalacoes.map((i) => ({
        ...i,
        data_instalacao: i.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: i.data_desinstalacao
          ? i.data_desinstalacao.toISOString().slice(0, 10)
          : null,
      })),
      quantidade_usada: instalacoes.reduce((sum, i) => sum + i.quantidade, 0),
      valor_count,
      instalados_count: instalacoes.length,
    }
  }
}
