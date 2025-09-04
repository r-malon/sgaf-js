import { createZodDto } from 'nestjs-zod'
import { valorSchema } from '@sgaf/shared'

export class CreateValorDto extends createZodDto(valorSchema) {}
