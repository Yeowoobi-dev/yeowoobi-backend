import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { CreateBookLogDto } from './dto/create-book-log.dto';
import { UpdateBookLogDto } from './dto/update-book-log.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
@UseGuards(AuthGuard('jwt'))
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}

  @Get('naver')
  async searchBooks(
    @Query('query') query: string,
    @Query('display') display?: number,
    @Query('start') start?: number,
  ) {
    return await this.bookLogService.searchBooks(query, display, start);
  }

  @Post('log')
  async createBookLog(
    @Req() req,
    @Body() createBookLogDto: {
      title: string;
      background: string;
      content: string;
      bookTitle: string;
      bookImage: string;
      author: string;
      publisher: string;
      review: string;
    }
  ) {
    // 프론트 데이터를 엔티티 형식으로 변환
    const bookLogData = {
      userId: req.user.id,
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
    return await this.bookLogService.getBookLog(req.user.id);

  }
  
  // 특정 독서록 상세 조회 ?

  // 특정 독서록 수정

  // 사용자의 독서록 목록 조회(고민 : 특정 사용자 or 본인)
}
