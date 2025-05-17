import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/exception.filter';
import { DatabaseExceptionFilter } from './common/filter/db-exception.filter';
import { MicroserviceExceptionFilter } from './common/filter/microservice-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 글로벌 파이프 적용
  app.useGlobalPipes(new ValidationPipe());
  
  // 글로벌 필터 적용
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter(),
    new MicroserviceExceptionFilter(),
  );
  
  // 글로벌 인터셉터 적용
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
