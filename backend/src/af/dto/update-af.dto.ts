import { PartialType } from '@nestjs/mapped-types'
import { CreateAfDto } from './create-af.dto'

export class UpdateAfDto extends PartialType(CreateAfDto) {}
