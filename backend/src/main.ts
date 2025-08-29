import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from "./http-exception.filter"
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  //app.enableCors({ origin: '*', methods: 'GET,POST,PATCH,DELETE' })
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter())
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap()
