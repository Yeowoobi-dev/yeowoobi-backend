import { NestFactory } from '@nestjs/core';
import { FreeCommunityModule } from './free-community/free-community.module';

async function bootstrap() {
  const app = await NestFactory.create(FreeCommunityModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
