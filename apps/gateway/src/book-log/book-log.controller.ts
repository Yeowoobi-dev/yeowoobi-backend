import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { AuthGuard } from '@nestjs/passport';
import { SaveBookLogDto } from './dto/book-log.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('book-logs')
@ApiBearerAuth()
@Controller('book-logs')
@UseGuards(AuthGuard('jwt'))
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}

  @ApiOperation({ summary: '도서 검색' })
  @ApiResponse({ status: 200, description: '도서 검색 성공' })
  @Get('search')
  async searchBooks(
    @Query('query') query: string,
    @Query('display') display?: number,
    @Query('start') start?: number,
  ) {
    return await this.bookLogService.searchBooks(query, display, start);
  }

  @ApiOperation({ summary: '도서 정보 저장' })
  @ApiResponse({ status: 201, description: '도서 정보 저장 성공' })
  @Post()
  async saveBookInfo(@Req() req, @Body() bookLog: SaveBookLogDto) {
    return await this.bookLogService.saveBookInfo(req.user.userId, bookLog);
  }

  @Post('log')
  async createBookLog(
    @Req() req,
    @Body() createBookLogDto: {
      title: string;
      background: string;
      content: string;
      review: string;
      bookTitle: string;
      bookImage: string;
      author: string;
      publisher: string;
    }
  ) {
    // 프론트 데이터를 엔티티 형식으로 변환
    const bookLogData = {
      userId: req.user.userId,
      logTitle: createBookLogDto.title,
      text: createBookLogDto.content,
      review: createBookLogDto.review,
      background: createBookLogDto.background,
      bookTitle: createBookLogDto.bookTitle,
      bookImage: createBookLogDto.bookImage,
      author: createBookLogDto.author,
      publisher: createBookLogDto.publisher,
      visibility: 'public' as const
    };

    return await this.bookLogService.createBookLog(bookLogData);
  }

  @Get('log')
  async getBookLog(@Req() req) {
    return await this.bookLogService.getBookLog(req.user.userId);
  }
}
