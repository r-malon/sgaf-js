import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { ItemService } from './item.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto, @Query('crudQuery') crudQuery: string) {
    const created = await this.itemService.create(createItemDto, { crudQuery })
    return created
  }

  @Get()
  async findMany(@Query('crudQuery') crudQuery: string) {
    const matches = await this.itemService.findMany({ crudQuery })
    return matches
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    const match = await this.itemService.findOne(id, { crudQuery })
    return match
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
    @Query('crudQuery') crudQuery: string,
  ) {
    const updated = await this.itemService.update(id, updateItemDto, { crudQuery })
    return updated
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    return this.itemService.remove(id, { crudQuery })
  }
}
