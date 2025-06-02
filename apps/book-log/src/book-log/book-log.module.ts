import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLog } from './entity/book-log.entity';
import { LogComment } from './entity/log-comment.entity';
import { LogCommentLike } from './entity/log-comment-like.entity';
import { BookLogLike } from './entity/book-log-like.entity';
import { BookLogController } from './book-log.controller';
import { BookLogService } from './book-log.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BookLogTcpController } from './book-log.tcp.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookLog, LogComment, LogCommentLike, BookLogLike]),
    HttpModule,
    ConfigModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'user',
          port: 5000,
        },
      },
    ]),
  ],
  controllers: [BookLogController, BookLogTcpController],
  providers: [BookLogService],
  exports: [BookLogService],
})
export class BookLogModule {}
