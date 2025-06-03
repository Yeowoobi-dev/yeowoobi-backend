import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3002);

  const microservice = await app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: 'user',
        port: 5000,
      },
    },
  );

  await app.startAllMicroservices();

}
bootstrap();
