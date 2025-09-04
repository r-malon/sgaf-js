import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ZodValidationPipe } from 'nestjs-zod'
import { HttpExceptionFilter } from './http-exception.filter'
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.useGlobalPipes(new ZodValidationPipe())

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter())
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
