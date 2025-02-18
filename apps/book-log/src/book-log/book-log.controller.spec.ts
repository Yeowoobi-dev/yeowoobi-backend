import { Test, TestingModule } from '@nestjs/testing';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';

describe('BookLogController', () => {
  let bookLogController: BookLogController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookLogController],
      providers: [BookLogService],
    }).compile();

    bookLogController = app.get<BookLogController>(BookLogController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(bookLogController.getHello()).toBe('Hello World!');
  //   });
  });
// });
