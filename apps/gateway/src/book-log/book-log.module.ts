import { Module } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { BookLogController } from './book-log.controller';

@Module({
  controllers: [BookLogController],
  providers: [BookLogService],
})
export class BookLogModule {}
