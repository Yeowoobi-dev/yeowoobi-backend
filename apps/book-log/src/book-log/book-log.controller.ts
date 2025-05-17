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

  
  // 특정 독서록 상세 조회 ?

  // 특정 독서록 수정

  // 사용자의 독서록 목록 조회(고민 : 특정 사용자 or 본인)
}
