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
}
