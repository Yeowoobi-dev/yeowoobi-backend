import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('여우비')
    .setDescription('여우비 api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc',app, document);

  app.useGlobalPipes(new ValidationPipe);
  await app.listen(process.env.HTTP_PORT ?? 3000);
  console.log("🔍 KAKAO_CLIENT_ID:", process.env.KAKAO_CLIENT_ID);
  console.log("🔍 KAKAO_REDIRECT_URI:", process.env.KAKAO_REDIRECT_URI);
  console.log("🔍 PORT:", process.env.HTTP_PORT);

}
bootstrap();
