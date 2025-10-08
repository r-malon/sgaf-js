import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/service'
import { CreateInstalacaoDto } from './dto/create-instalacao.dto'
import { UpdateInstalacaoDto } from './dto/update-instalacao.dto'
import { AttachLocaisDto } from './dto/attach-locais.dto'
import { type Instalacao } from '@sgaf/shared'

@Injectable()
export class InstalacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInstalacaoDto): Promise<Instalacao> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: dto.itemId },
        include: { instalacoes: true },
      })

      // Validate quantidade constraint
      const currentTotal = item.instalacoes.reduce(
        (sum, il) => sum + il.quantidade,
        0,
      )
      if (currentTotal + dto.quantidade > item.quantidade_maxima) {
        throw new BadRequestException(
          `Quantidade total (${currentTotal + dto.quantidade}) excede máximo (${item.quantidade_maxima})`,
        )
      }

      // Validate banda constraint
      if (dto.banda_instalada > item.banda_maxima) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima',
        )
      }

      const instalacao = await tx.instalacao.create({
        data: {
          itemId: dto.itemId,
          localId: dto.localId,
          banda_instalada: dto.banda_instalada,
          data_instalacao: new Date(dto.data_instalacao),
          data_desinstalacao: dto.data_desinstalacao
            ? new Date(dto.data_desinstalacao)
            : null,
          quantidade: dto.quantidade,
          status: dto.status,
        },
        include: {
          local: { select: { id: true, nome: true } },
          item: { select: { id: true, descricao: true } },
        },
      })

      return {
        id: instalacao.id,
        itemId: instalacao.itemId,
        localId: instalacao.localId,
        banda_instalada: instalacao.banda_instalada,
        data_instalacao: instalacao.data_instalacao.toISOString().slice(0, 10),
        data_desinstalacao: instalacao.data_desinstalacao
          ? instalacao.data_desinstalacao.toISOString().slice(0, 10)
          : null,
        quantidade: instalacao.quantidade,
        status: instalacao.status,
        local: instalacao.local,
        item: instalacao.item,
      }
    })
  }

  async attachLocais(dto: AttachLocaisDto): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.findUniqueOrThrow({
        where: { id: dto.itemId },
        include: { instalacoes: true },
      })

      // Validate total quantidade
      const currentTotal = item.instalacoes.reduce(
        (sum, il) => sum + il.quantidade,
        0,
      )
      const newTotal = dto.locais.reduce(
        (sum, local) => sum + local.quantidade,
        0,
      )

      if (currentTotal + newTotal > item.quantidade_maxima) {
        throw new BadRequestException(
          `Quantidade total (${currentTotal + newTotal}) excede máximo (${item.quantidade_maxima})`,
        )
      }

      // Validate banda constraints
      for (const local of dto.locais) {
        if (local.banda_instalada > item.banda_maxima) {
          throw new BadRequestException(
            'Banda instalada não pode exceder banda máxima',
          )
        }
      }

      // Create all Instalacao records
      await Promise.all(
        dto.locais.map((local) =>
          tx.instalacao.create({
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
          }),
        ),
      )
    })
  }

  async findMany(query: {
    itemId?: number
    localId?: number
  }): Promise<Instalacao[]> {
    const where: { itemId?: number; localId?: number } = {}
    if (query.itemId) where.itemId = query.itemId
    if (query.localId) where.localId = query.localId

    const instalacoes = await this.prisma.instalacao.findMany({
      where,
      include: {
        local: { select: { id: true, nome: true } },
        item: { select: { id: true, descricao: true } },
      },
    })

    return instalacoes.map((il) => ({
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

  async findOne(id: number): Promise<Instalacao | null> {
    const instalacao = await this.prisma.instalacao.findUniqueOrThrow({
      where: { id },
      include: {
        local: { select: { id: true, nome: true } },
        item: { select: { id: true, descricao: true } },
      },
    })

    return {
      id: instalacao.id,
      itemId: instalacao.itemId,
      localId: instalacao.localId,
      banda_instalada: instalacao.banda_instalada,
      data_instalacao: instalacao.data_instalacao.toISOString().slice(0, 10),
      data_desinstalacao: instalacao.data_desinstalacao
        ? instalacao.data_desinstalacao.toISOString().slice(0, 10)
        : null,
      quantidade: instalacao.quantidade,
      status: instalacao.status,
      local: instalacao.local,
      item: instalacao.item,
    }
  }

  async update(
    id: number,
    updateDto: UpdateInstalacaoDto,
  ): Promise<Instalacao> {
    return await this.prisma.$transaction(async (tx) => {
      const current = await tx.instalacao.findUniqueOrThrow({
        where: { id },
      })

      const item = await tx.item.findUniqueOrThrow({
        where: { id: current.itemId },
        include: { instalacoes: true },
      })

      // Validate banda constraint if updating
      if (
        updateDto.banda_instalada !== undefined &&
        updateDto.banda_instalada > item.banda_maxima
      ) {
        throw new BadRequestException(
          'Banda instalada não pode exceder banda máxima',
        )
      }

      // Validate quantidade constraint if updating
      if (updateDto.quantidade !== undefined) {
        const otherQuantidades = item.instalacoes
          .filter((il) => il.id !== id)
          .reduce((sum, il) => sum + il.quantidade, 0)

        if (otherQuantidades + updateDto.quantidade > item.quantidade_maxima) {
          throw new BadRequestException(
            `Quantidade (${otherQuantidades + updateDto.quantidade}) excede máximo (${item.quantidade_maxima})`,
          )
        }
      }

      const updated = await tx.instalacao.update({
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
    await this.prisma.instalacao.delete({
      where: { id },
    })
  }
}
