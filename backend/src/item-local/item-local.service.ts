import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateItemLocalDto } from './dto/create-item-local.dto'
import { UpdateItemLocalDto } from './dto/update-item-local.dto'
import { AttachLocaisDto } from './dto/attach-locais.dto'
import { type ItemLocal } from '@sgaf/shared'

@Injectable()
export class ItemLocalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateItemLocalDto): Promise<ItemLocal> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: createDto.itemId },
        include: { itemLocais: true },
      })

      // Validate quantidade constraint
      const currentTotal = item.itemLocais.reduce(
        (sum, il) => sum + il.quantidade,
        0
      )
      if (currentTotal + createDto.quantidade > item.quantidade_maxima) {
        throw new BadRequestException(
          `Quantidade total (${currentTotal + createDto.quantidade}) excede máximo (${item.quantidade_maxima})`
        )
      }

      // Validate banda constraint
      if (createDto.banda_instalada > item.banda_maxima) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima'
        )
      }

      const itemLocal = await tx.itemLocal.create({
        data: {
          itemId: createDto.itemId,
          localId: createDto.localId,
          banda_instalada: createDto.banda_instalada,
          data_instalacao: new Date(createDto.data_instalacao),
          data_desinstalacao: createDto.data_desinstalacao
            ? new Date(createDto.data_desinstalacao)
            : null,
          quantidade: createDto.quantidade,
          status: createDto.status,
        },
        include: {
          local: { select: { id: true, nome: true } },
          item: { select: { id: true, descricao: true } },
        },
      })

      return {
        id: itemLocal.id,
        itemId: itemLocal.itemId,
        localId: itemLocal.localId,
        banda_instalada: itemLocal.banda_instalada,
        data_instalacao: itemLocal.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: itemLocal.data_desinstalacao
          ? itemLocal.data_desinstalacao.toISOString().slice(0, 10)
          : null,
        quantidade: itemLocal.quantidade,
        status: itemLocal.status,
        local: itemLocal.local,
        item: itemLocal.item,
      }
    })
  }

  async attachLocais(dto: AttachLocaisDto): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: dto.itemId },
        include: { itemLocais: true },
      })

      // Validate total quantidade
      const currentTotal = item.itemLocais.reduce(
        (sum, il) => sum + il.quantidade,
        0
      )
      const newTotal = dto.locais.reduce(
        (sum, local) => sum + local.quantidade,
        0
      )

      if (currentTotal + newTotal > item.quantidade_maxima) {
        throw new BadRequestException(
          `Quantidade total (${currentTotal + newTotal}) excede máximo (${item.quantidade_maxima})`
        )
      }

      // Validate banda constraints
      for (const local of dto.locais) {
        if (local.banda_instalada > item.banda_maxima) {
          throw new BadRequestException(
            'Banda instalada não pode exceder banda máxima'
          )
        }
      }

      // Create all ItemLocal records
      await Promise.all(
        dto.locais.map((local) =>
          tx.itemLocal.create({
            data: {
              itemId: dto.itemId,
              localId: local.localId,
              banda_instalada: local.banda_instalada,
              data_instalacao: new Date(local.data_instalacao),
              data_desinstalacao: local.data_desinstalacao
                ? new Date(local.data_desinstalacao)
                : null,
              quantidade: local.quantidade,
              status: local.status,
            },
          })
        )
      )
    })
  }

  async findMany(query: {
    itemId?: number
    localId?: number
  }): Promise<ItemLocal[]> {
    const where: any = {}
    if (query.itemId) where.itemId = query.itemId
    if (query.localId) where.localId = query.localId

    const itemLocais = await this.prisma.itemLocal.findMany({
      where,
      include: {
        local: { select: { id: true, nome: true } },
        item: { select: { id: true, descricao: true } },
      },
    })

    return itemLocais.map((il) => ({
      id: il.id,
      itemId: il.itemId,
      localId: il.localId,
      banda_instalada: il.banda_instalada,
      data_instalacao: il.data_instalacao.toISOString().slice(0, 10),
      data_desinstalacao: il.data_desinstalacao
        ? il.data_desinstalacao.toISOString().slice(0, 10)
        : null,
      quantidade: il.quantidade,
      status: il.status,
      local: il.local,
      item: il.item,
    }))
  }

  async findOne(id: number): Promise<ItemLocal | null> {
    const itemLocal = await this.prisma.itemLocal.findUnique({
      where: { id },
      include: {
        local: { select: { id: true, nome: true } },
        item: { select: { id: true, descricao: true } },
      },
    })

    if (!itemLocal) return null

    return {
      id: itemLocal.id,
      itemId: itemLocal.itemId,
      localId: itemLocal.localId,
      banda_instalada: itemLocal.banda_instalada,
      data_instalacao: itemLocal.data_instalacao.toISOString().slice(0, 10),
      data_desinstalacao: itemLocal.data_desinstalacao
        ? itemLocal.data_desinstalacao.toISOString().slice(0, 10)
        : null,
      quantidade: itemLocal.quantidade,
      status: itemLocal.status,
      local: itemLocal.local,
      item: itemLocal.item,
    }
  }

  async update(id: number, updateDto: UpdateItemLocalDto): Promise<ItemLocal> {
    return await this.prisma.$transaction(async (tx) => {
      const current = await tx.itemLocal.findUniqueOrThrow({
        where: { id },
      })

      const item = await tx.item.findUniqueOrThrow({
        where: { id: current.itemId },
        include: { itemLocais: true },
      })

      // Validate banda constraint if updating
      if (
        updateDto.banda_instalada !== undefined &&
        updateDto.banda_instalada > item.banda_maxima
      ) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima'
        )
      }

      // Validate quantidade constraint if updating
      if (updateDto.quantidade !== undefined) {
        const otherQuantidades = item.itemLocais
          .filter((il) => il.id !== id)
          .reduce((sum, il) => sum + il.quantidade, 0)

        if (otherQuantidades + updateDto.quantidade > item.quantidade_maxima) {
          throw new BadRequestException(
            `Total quantidade (${otherQuantidades + updateDto.quantidade}) excederia máximo (${item.quantidade_maxima})`
          )
        }
      }

      const updated = await tx.itemLocal.update({
        where: { id },
        data: {
          banda_instalada: updateDto.banda_instalada,
          data_instalacao: updateDto.data_instalacao
            ? new Date(updateDto.data_instalacao)
            : undefined,
          data_desinstalacao: updateDto.data_desinstalacao
            ? new Date(updateDto.data_desinstalacao)
            : undefined,
          quantidade: updateDto.quantidade,
          status: updateDto.status,
        },
        include: {
          local: { select: { id: true, nome: true } },
          item: { select: { id: true, descricao: true } },
        },
      })

      return {
        id: updated.id,
        itemId: updated.itemId,
        localId: updated.localId,
        banda_instalada: updated.banda_instalada,
        data_instalacao: updated.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: updated.data_desinstalacao
          ? updated.data_desinstalacao.toISOString().slice(0, 10)
          : null,
        quantidade: updated.quantidade,
        status: updated.status,
        local: updated.local,
        item: updated.item,
      }
    })
  }

  async delete(id: number): Promise<void> {
    await this.prisma.itemLocal.delete({
      where: { id },
    })
  }
}
