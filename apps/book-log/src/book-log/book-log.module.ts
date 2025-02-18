import { Module } from '@nestjs/common';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [BookLogController],
  providers: [BookLogService],
})
export class BookLogModule {}
