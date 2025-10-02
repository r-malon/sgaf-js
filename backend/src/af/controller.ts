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
import { AfService } from './service'
import { CreateAfDto } from './dto/create-af.dto'
import { UpdateAfDto } from './dto/update-af.dto'

@Controller('af')
export class AfController {
  constructor(private readonly afService: AfService) {}

  @Post()
  async create(@Body() createAfDto: CreateAfDto) {
    return await this.afService.create(createAfDto)
  }

  @Get()
  async findMany(@Query('contratoId') contratoId?: number) {
    if (contratoId) return await this.afService.findManyByContrato(+contratoId)
    return await this.afService.findMany()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.afService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAfDto: UpdateAfDto,
  ) {
    return await this.afService.update(id, updateAfDto)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.afService.delete(id)
  }
}
