import { PartialType } from '@nestjs/mapped-types';
import { CreateValorDto } from './create-valor.dto';

export class UpdateValorDto extends PartialType(CreateValorDto) {}
