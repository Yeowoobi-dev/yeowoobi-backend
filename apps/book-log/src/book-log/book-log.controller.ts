import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { SaveBookLogDto } from './dto/book-log.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}

  // 도서 정보 api 조회
  @Get('naver')
  async bookInfoList(
    @Query('query') query: string,
    @Query('display') display?: number,
    @Query('start') start?: number,
  ) {
    if (!query) {
      return { text: '검색어는 필수입니다.'}
    }

    const books = await this.bookLogService.searchBooks(query, display, start);
    return {books: books}
  }
  // 독서록 작성
  @Post('book-log')
  async bookInfoSave( @Req() req, @Body() dto: SaveBookLogDto) {
      const currentUserId = req.user.userId;
      const book = await this.bookLogService.saveBookInfo(currentUserId, dto);

      return { book }
  }
  
  // 특정 독서록 상세 조회 ?

  // 특정 독서록 수정

  // 사용자의 독서록 목록 조회(고민 : 특정 사용자 or 본인)
}
