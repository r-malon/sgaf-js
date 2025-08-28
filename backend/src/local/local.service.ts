import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLocalDto } from './dto/create-local.dto'
import { UpdateLocalDto } from './dto/update-local.dto'
import { Local } from '@sgaf/shared'

@Injectable()
export class LocalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLocalDto: CreateLocalDto): Promise<Local> {
    const local = await this.prisma.local.create({
      data: createLocalDto,
    })

    return local
  }

  async findMany(): Promise<Local[]> {
    const locals: Local[] = await this.prisma.local.findMany()

    return locals
  }

  async findOne(id: number): Promise<Local | null> {
    const local: Local | null = await this.prisma.local.findUnique({
      where: { id },
    })

    if (!local) throw new NotFoundException(`Local with ID ${id} not found`)

    return local
  }

  async update(id: number, updateLocalDto: UpdateLocalDto): Promise<Local> {
    const local = await this.prisma.local.update({
      where: { id },
      data: updateLocalDto,
    })

    return local
  }

  async delete(id: number): Promise<void> {
    await this.prisma.local.delete({
      where: { id },
    })
  }
}
