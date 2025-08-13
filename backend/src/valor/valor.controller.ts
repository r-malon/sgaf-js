import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ValorService } from './valor.service';
import { CreateValorDto } from './dto/create-valor.dto';
import { UpdateValorDto } from './dto/update-valor.dto';

@Controller('valor')
export class ValorController {
  constructor(private readonly valorService: ValorService) {}

  @Post()
  async create(@Body() createValorDto: CreateValorDto, @Query('crudQuery') crudQuery: string) {
    const created = await this.valorService.create(createValorDto, { crudQuery });
    return created;
  }

  @Get()
  async findMany(@Query('crudQuery') crudQuery: string) {
    const matches = await this.valorService.findMany({ crudQuery });
    return matches;
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    const match = await this.valorService.findOne(id, { crudQuery });
    return match;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateValorDto: UpdateValorDto,
    @Query('crudQuery') crudQuery: string,
  ) {
    const updated = await this.valorService.update(id, updateValorDto, { crudQuery });
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Query('crudQuery') crudQuery: string) {
    return this.valorService.remove(id, { crudQuery });
  }
}
