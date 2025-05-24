import { Test, TestingModule } from '@nestjs/testing';
import { BookRecommendationController } from './book-recommendation.controller';
import { BookRecommendationService } from './book-recommendation.service';

describe('BookRecommendationController', () => {
  let bookRecommendationController: BookRecommendationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookRecommendationController],
      providers: [BookRecommendationService],
    }).compile();

    bookRecommendationController = app.get<BookRecommendationController>(BookRecommendationController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bookRecommendationController.getHello()).toBe('Hello World!');
    });
  });
});
