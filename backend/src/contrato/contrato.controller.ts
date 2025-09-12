import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { ContratoService } from './contrato.service'
import { CreateContratoDto } from './dto/create-contrato.dto'
import { UpdateContratoDto } from './dto/update-contrato.dto'

@Controller('contrato')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @Post()
  async create(@Body() createContratoDto: CreateContratoDto) {
    return await this.contratoService.create(createContratoDto)
  }

  @Get()
  async findMany() {
    return await this.contratoService.findMany()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.contratoService.findOne(+id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContratoDto: UpdateContratoDto,
  ) {
    return await this.contratoService.update(+id, updateContratoDto)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.contratoService.delete(+id)
  }
}
