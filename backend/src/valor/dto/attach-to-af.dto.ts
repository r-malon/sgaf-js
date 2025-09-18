import { createZodDto } from 'nestjs-zod'
import { attachToAfSchema } from '@sgaf/shared'

export class AttachToAfDto extends createZodDto(attachToAfSchema) {}
