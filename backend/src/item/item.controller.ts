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
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { AttachLocaisDto } from './dto/attach-locais.dto'

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto)
  }

  @Post('locais')
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachLocais(@Body() dto: AttachLocaisDto) {
    await this.itemService.attachLocais(dto)
  }

  @Get()
  async findMany(@Query('afId', ParseIntPipe) afId: number) {
    return await this.itemService.findManyByAf(afId)
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('afId', ParseIntPipe) afId: number,
  ) {
    return await this.itemService.findOne(id, afId)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return await this.itemService.update(id, updateItemDto)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.itemService.delete(id)
  }
}
