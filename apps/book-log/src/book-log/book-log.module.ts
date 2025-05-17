import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLog } from './entities/book-log.entity';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BookLogTcpController } from './book-log.tcp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookLog]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [BookLogController, BookLogTcpController],
  providers: [BookLogService],
  exports: [BookLogService],
})
export class BookLogModule {}
