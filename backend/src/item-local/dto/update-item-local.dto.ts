import { createZodDto } from 'nestjs-zod'
import { updateItemLocalSchema } from '@sgaf/shared'

export class UpdateItemLocalDto extends createZodDto(updateItemLocalSchema) {}
