import { createZodDto } from "nestjs-zod"
import { localSchema } from "@sgaf/shared"

export class CreateLocalDto extends createZodDto(localSchema) {}
