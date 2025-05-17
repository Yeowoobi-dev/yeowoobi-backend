import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SaveBookLogDto } from './dto/book-log.dto';

@Injectable()
export class BookLogService {
  constructor(
    @Inject('BOOK_LOG_SERVICE') private readonly bookLogClient: ClientProxy,
  ) {}

  async searchBooks(query: string, display = 10, start = 1) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'searchBooks' }, { query, display, start }),
    );
  }

  async saveBookInfo(userId: string, bookLog: SaveBookLogDto) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'saveBookInfo' }, { userId, bookLog }),
    );
  }
}
