import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('여우비')
    .setDescription('여우비 api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc',app, document);
  
  app.useGlobalInterceptors(new ResponseInterceptor);
  app.useGlobalPipes(new ValidationPipe);

  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
