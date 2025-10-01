import { createZodDto } from 'nestjs-zod'
import { itemLocalSchema } from '@sgaf/shared'

export class CreateItemLocalDto extends createZodDto(itemLocalSchema) {}
