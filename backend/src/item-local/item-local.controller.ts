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
import { ItemLocalService } from './item-local.service'
import { CreateItemLocalDto } from './dto/create-item-local.dto'
import { UpdateItemLocalDto } from './dto/update-item-local.dto'
import { AttachLocaisDto } from './dto/attach-locais.dto'

@Controller('item-local')
export class ItemLocalController {
  constructor(private readonly itemLocalService: ItemLocalService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachLocais(@Body() dto: AttachLocaisDto) {
    await this.itemLocalService.attachLocais(dto)
  }

  @Get()
  async findMany(
    @Query('itemId', new ParseIntPipe({ optional: true })) itemId?: number,
    @Query('localId', new ParseIntPipe({ optional: true })) localId?: number,
  ) {
    return await this.itemLocalService.findMany({ itemId, localId })
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.itemLocalService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateItemLocalDto,
  ) {
    return await this.itemLocalService.update(id, updateDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.itemLocalService.delete(id)
  }
}
