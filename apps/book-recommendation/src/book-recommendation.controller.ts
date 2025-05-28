import { Controller, Post, Body } from '@nestjs/common';
import { BookRecommendationService } from './book-recommendation.service';

@Controller('book-recommendation')
export class BookRecommendationController {
  constructor(private readonly bookRecommendationService: BookRecommendationService) {}

  @Post('recommend')
  async recommendBook(@Body() body: { answers: string[] }) {
    return await this.bookRecommendationService.recommendBookWithSearch(body.answers);
  }
}
