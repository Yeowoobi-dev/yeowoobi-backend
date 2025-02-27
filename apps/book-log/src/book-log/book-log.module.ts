import { Module } from '@nestjs/common';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLog } from './entity/book-log.entity';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forFeature([BookLog])
  ],
  controllers: [BookLogController],
  providers: [BookLogService],
})
export class BookLogModule {}
