import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Erro interno do servidor"

    switch (exception.code) {
      case "P2002": // Unique constraint failed
        message = "Já existe um registro com esses dados únicos"
        status = HttpStatus.CONFLICT
        break
      case "P2003": // Foreign key constraint failed
        message = "Não é possível remover ou atualizar pois há registros relacionados"
        status = HttpStatus.BAD_REQUEST
        break
      case "P2025": // Record not found
        message = "Registro não encontrado"
        status = HttpStatus.NOT_FOUND
        break
      default:
        message = "Erro no banco de dados"
        status = HttpStatus.BAD_REQUEST
    }

    // Send JSON response for frontend toast
    response.status(status).json({
      statusCode: status,
      message,
    })
  }
}
