import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { AuthGuard } from '@nestjs/passport';
import { SaveBookLogDto } from './dto/book-log.dto';

@Controller('book-logs')
@UseGuards(AuthGuard('jwt'))
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}

  @Get('search')
  async searchBooks(
    @Query('query') query: string,
    @Query('display') display?: number,
    @Query('start') start?: number,
  ) {
    return await this.bookLogService.searchBooks(query, display, start);
  }

  @Post()
  async saveBookInfo(@Req() req, @Body() bookLog: SaveBookLogDto) {
    return await this.bookLogService.saveBookInfo(req.user.userId, bookLog);
  }
}
