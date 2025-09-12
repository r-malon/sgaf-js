import { createZodDto } from 'nestjs-zod'
import { contratoSchema } from '@sgaf/shared'

export class CreateContratoDto extends createZodDto(contratoSchema) {}
