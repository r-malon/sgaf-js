import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateValorDto } from './dto/create-valor.dto'
import { UpdateValorDto } from './dto/update-valor.dto'
import { Valor } from '@sgaf/shared'

@Injectable()
export class ValorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createValorDto: CreateValorDto): Promise<Valor> {
    const valor = await this.prisma.valor.create({
      data: createValorDto, 
    })

    return valor
  }

  async findMany(): Promise<Valor[]> {
    const valores: Valor[] = await this.prisma.valor.findMany()

    return valores
  }

  async findOne(id: number): Promise<Valor | null> {
    const valor: Valor | null = await this.prisma.valor.findUnique({
      where: { id }, 
    })

    if (!valor) throw new NotFoundException(`Valor with ID ${id} not found`)

    return valor
  }

  async delete(id: number): Promise<void> {
    await this.prisma.valor.delete({
      where: { id },
    })
  }
}
