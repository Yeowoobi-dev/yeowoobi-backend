import { NestFactory } from '@nestjs/core';
import { BookRecommendationModule } from './book-recommendation.module';

async function bootstrap() {
  const app = await NestFactory.create(BookRecommendationModule);
  await app.listen(3001);
}
bootstrap();
