import { Controller, Get, Post, Body, Patch, Param, Query, Delete, ParseIntPipe } from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto)
  }

  @Get()
  findMany(@Query('AF_id') afId?: string) {
    if (afId)
      return this.itemService.findManyByAf(+afId)
    return this.itemService.findMany()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.itemService.delete(+id)
  }
}
