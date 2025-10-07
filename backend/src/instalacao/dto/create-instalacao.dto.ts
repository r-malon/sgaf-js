import { createZodDto } from 'nestjs-zod'
import { instalacaoSchema } from '@sgaf/shared'

export class CreateInstalacaoDto extends createZodDto(instalacaoSchema) {}
