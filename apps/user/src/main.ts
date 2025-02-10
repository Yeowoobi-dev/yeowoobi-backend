import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/filter/exception.filter';
import { DatabaseExceptionFilter } from './common/filter/db-exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('여우비')
    .setDescription('여우비 api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc',app, document);
  
  app.useGlobalInterceptors(new ResponseInterceptor);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter(), new DatabaseExceptionFilter());

  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
