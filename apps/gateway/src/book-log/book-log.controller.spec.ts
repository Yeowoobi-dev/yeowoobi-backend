import { Test, TestingModule } from '@nestjs/testing';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';

describe('BookLogController', () => {
  let controller: BookLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLogController],
      providers: [BookLogService],
    }).compile();

    controller = module.get<BookLogController>(BookLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
