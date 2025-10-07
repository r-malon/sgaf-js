import { createZodDto } from 'nestjs-zod'
import { updateInstalacaoSchema } from '@sgaf/shared'

export class UpdateInstalacaoDto extends createZodDto(updateInstalacaoSchema) {}
