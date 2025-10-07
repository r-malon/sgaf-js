import { createZodDto } from 'nestjs-zod'
import { attachLocaisSchema } from '@sgaf/shared'

export class AttachLocaisDto extends createZodDto(attachLocaisSchema) {}
