import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { ValorService } from './valor.service'
import { CreateValorDto } from './dto/create-valor.dto'

@Controller('valor')
export class ValorController {
  constructor(private readonly valorService: ValorService) {}

  @Post()
  async create(@Body() createValorDto: CreateValorDto) {
    return await this.valorService.create(createValorDto)
  }

  @Get()
  async findMany(@Query('Item_id') itemId?: number) {
    if (itemId) return this.valorService.findManyByItem(+itemId)
    return await this.valorService.findMany()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.valorService.findOne(+id)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.valorService.delete(+id)
  }
}
