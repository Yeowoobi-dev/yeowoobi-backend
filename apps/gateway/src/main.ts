import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filter/exception.filter';
import { DatabaseExceptionFilter } from './common/filter/db-exception.filter';
import { MicroserviceExceptionFilter } from './common/filter/microservice-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Yeowoobi API')
    .setDescription('Yeowoobi API documentation')
    .setVersion('1.0')
    .addTag('auth', '인증 관련 API')
    .addTag('user', '사용자 관련 API')
    .addTag('book-log', '독서 기록 관련 API')
    .addTag('community', '커뮤니티 관련 API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
