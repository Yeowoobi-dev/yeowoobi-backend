import { Module } from '@nestjs/common';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';

@Module({
  imports: [],
  controllers: [BookLogController],
  providers: [BookLogService],
})
export class BookLogModule {}
