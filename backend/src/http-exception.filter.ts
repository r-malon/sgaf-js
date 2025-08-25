import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { Response } from "express"

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = "Erro interno do servidor"

    if (exception instanceof HttpException) {
      status = exception.getStatus()

      const res = exception.getResponse()
      if (typeof res === "string") {
        message = res
      } else if (typeof res === "object" && res !== null) {
        const { message: msg } = res as any
        if (Array.isArray(msg)) {
          // Nest validation pipes often return an array
          message = msg.join(", ")
        } else if (msg) {
          message = msg
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message
    }

    response.status(status).json({
      statusCode: status,
      message,
    })
  }
}
