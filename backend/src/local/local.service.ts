import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLocalDto } from './dto/create-local.dto'
import { UpdateLocalDto } from './dto/update-local.dto'
import { Local } from '@sgaf/shared'
import { normalize } from '../utils/normalize'

@Injectable()
export class LocalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLocalDto: CreateLocalDto): Promise<Local> {
    const local = await this.prisma.local.create({
      data: {
        ...createLocalDto,
        nome_normalized: normalize(createLocalDto.nome as string),
      },
    })

    return local
  }

  async findMany(): Promise<Local[]> {
    const locals: Local[] = await this.prisma.local.findMany()

    return locals
  }

  async findOne(id: number): Promise<Local | null> {
    const local = await this.prisma.local.findUniqueOrThrow({
      where: { id },
    })

    return local
  }

  async update(id: number, updateLocalDto: UpdateLocalDto): Promise<Local> {
    const local = await this.prisma.local.update({
      where: { id },
      data: {
        ...updateLocalDto,
        nome_normalized: normalize(updateLocalDto.nome as string),
      },
    })

    return local
  }

  async delete(id: number): Promise<void> {
    await this.prisma.local.delete({
      where: { id },
    })
  }
}
