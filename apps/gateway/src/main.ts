import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app. useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
