import { Test, TestingModule } from '@nestjs/testing';
import { BookLogService } from './book-log.service';

describe('BookLogService', () => {
  let service: BookLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookLogService],
    }).compile();

    service = module.get<BookLogService>(BookLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
