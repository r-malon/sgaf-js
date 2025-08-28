import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common'
import { LocalService } from './local.service'
import { CreateLocalDto } from './dto/create-local.dto'
import { UpdateLocalDto } from './dto/update-local.dto'

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  async create(@Body() createLocalDto: CreateLocalDto) {
    return await this.localService.create(createLocalDto)
  }

  @Get()
  async findMany() {
    return await this.localService.findMany()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.localService.findOne(+id)
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateLocalDto: UpdateLocalDto) {
    return await this.localService.update(+id, updateLocalDto)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.localService.delete(+id)
  }
}
