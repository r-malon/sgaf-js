import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { type Response } from 'express'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: string

    switch (exception.code) {
      case 'P2002':
        message = 'Já existe um registro com esses dados únicos'
        status = HttpStatus.CONFLICT
        break
      case 'P2003':
        message =
          'Não é possível remover/atualizar pois há registros relacionados'
        status = HttpStatus.BAD_REQUEST
        break
      case 'P2025':
        message = 'Registro não encontrado'
        status = HttpStatus.NOT_FOUND
        break
      default:
        message = exception.message
        status = HttpStatus.BAD_REQUEST
    }

    response.status(status).json({ statusCode: status, message })
  }
}
