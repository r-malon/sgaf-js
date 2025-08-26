import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { LocalService } from './local.service'
import { CreateLocalDto } from './dto/create-local.dto'
import { UpdateLocalDto } from './dto/update-local.dto'

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  async create(@Body() createLocalDto: CreateLocalDto, @Query('crudQuery') crudQuery: string) {
    const created = await this.localService.create(createLocalDto, { crudQuery })
    return created
  }

  @Get()
  async findMany(@Query('crudQuery') crudQuery: string) {
    const matches = await this.localService.findMany({ crudQuery })
    return matches
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    const match = await this.localService.findOne(id, { crudQuery })
    return match
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLocalDto: UpdateLocalDto,
    @Query('crudQuery') crudQuery: string,
  ) {
    const updated = await this.localService.update(id, updateLocalDto, { crudQuery })
    return updated
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    return this.localService.remove(id, { crudQuery })
  }
}
