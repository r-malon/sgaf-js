import { createZodDto } from 'nestjs-zod'
import { itemSchema } from '@sgaf/shared'

export class CreateItemDto extends createZodDto(itemSchema) {}
