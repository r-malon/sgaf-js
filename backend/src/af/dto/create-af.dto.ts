import { createZodDto } from "nestjs-zod"
import { afSchema } from "@sgaf/shared"

export class CreateAfDto extends createZodDto(afSchema) {}
