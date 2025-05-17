import { Module } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { BookLogController } from './book-log.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOK_LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'book-log',
          port: 5001,
        },
      },
    ]),
  ],
  controllers: [BookLogController],
  providers: [BookLogService],
})
export class BookLogModule {}
