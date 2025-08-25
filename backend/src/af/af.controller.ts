import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { AfService } from './af.service'
import { CreateAfDto } from './dto/create-af.dto'
import { UpdateAfDto } from './dto/update-af.dto'

@Controller('af')
export class AfController {
  constructor(private readonly afService: AfService) {}

  @Post()
  async create(@Body() createAfDto: CreateAfDto, @Query('crudQuery') crudQuery: string) {
    const created = await this.afService.create(createAfDto, { crudQuery })
    return created
  }

  @Get()
  async findMany(@Query('crudQuery') crudQuery: string) {
    const matches = await this.afService.findMany({ crudQuery })
    return matches
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    const match = await this.afService.findOne(id, { crudQuery })
    return match
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAfDto: UpdateAfDto,
    @Query('crudQuery') crudQuery: string,
  ) {
    const updated = await this.afService.update(id, updateAfDto, { crudQuery })
    return updated
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    return this.afService.remove(id, { crudQuery })
  }
}
