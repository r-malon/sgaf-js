import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { ValorService } from './valor.service'
import { AttachToAfDto } from './dto/attach-to-af.dto'

@Controller('valor')
export class ValorController {
  constructor(private readonly valorService: ValorService) {}

  @Post()
  async attachItemsToAf(@Body() dto: AttachToAfDto) {
    await this.valorService.attachItemsToAf(dto)
  }

  @Get()
  async findMany(
    @Query('itemId', ParseIntPipe) itemId: number,
    @Query('afId', ParseIntPipe) afId: number,
  ) {
    return await this.valorService.findMany(itemId, afId)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.valorService.delete(+id)
  }
}
