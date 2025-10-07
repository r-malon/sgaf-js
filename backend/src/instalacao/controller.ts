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
import { InstalacaoService } from './service'
import { CreateInstalacaoDto } from './dto/create-instalacao.dto'
import { UpdateInstalacaoDto } from './dto/update-instalacao.dto'
import { AttachLocaisDto } from './dto/attach-locais.dto'

@Controller('instalacao')
export class InstalacaoController {
  constructor(private readonly instalacaoService: InstalacaoService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachLocais(@Body() dto: AttachLocaisDto) {
    await this.instalacaoService.attachLocais(dto)
  }

  @Get()
  async findMany(
    @Query('itemId', new ParseIntPipe({ optional: true })) itemId?: number,
    @Query('localId', new ParseIntPipe({ optional: true })) localId?: number,
  ) {
    return await this.instalacaoService.findMany({ itemId, localId })
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.instalacaoService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateInstalacaoDto,
  ) {
    return await this.instalacaoService.update(id, updateDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.instalacaoService.delete(id)
  }
}
