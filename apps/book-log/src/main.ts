import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.moudule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
