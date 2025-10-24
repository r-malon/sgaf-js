import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ValorService } from './service'
import { AttachToAfDto } from './dto/attach-to-af.dto'

@Controller('valor')
export class ValorController {
  constructor(private readonly valorService: ValorService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachItemsToAf(@Body() dto: AttachToAfDto) {
    await this.valorService.attachItemsToAf(dto)
  }

  @Get()
  async findMany(
    @Query('itemId', new ParseIntPipe({ optional: true })) itemId?: number,
    @Query('afId', new ParseIntPipe({ optional: true })) afId?: number,
  ) {
    return await this.valorService.findMany(itemId, afId)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.valorService.delete(id)
  }
}
