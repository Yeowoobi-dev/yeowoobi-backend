import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookRecommendationController } from './book-recommendation.controller';
import { BookRecommendationService } from './book-recommendation.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/book-recommendation/.env',
      validationSchema: Joi.object({
        OPENAI_API_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [BookRecommendationController],
  providers: [BookRecommendationService],
})
export class BookRecommendationModule {}
