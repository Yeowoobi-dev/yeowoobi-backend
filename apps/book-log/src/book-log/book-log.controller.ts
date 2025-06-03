import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { BookLogService } from './book-log.service';
import { CreateBookLogDto } from './dto/create-book-log.dto';
import { UpdateBookLogDto } from './dto/update-book-log.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateLogCommentDto } from './dto/create-log-comment.dto';

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

  @Get('log/:id')
  async getBookLogById(@Req() req, @Param('id') bookId: number) {
    return await this.bookLogService.getBookLogById(req.user.id, bookId);
  }

  @Get('log')
  async getBookLog(@Req() req) {
    return await this.bookLogService.getBookLog(req.user.id);

  }

  @Get('log/list')
  async getBookLogList(@Req() req) {
    return await this.bookLogService.getBookLogList(req.user.id);
  }

  @Post('log/:id/comment')
  async createComment(
    @Req() req,
    @Param('id') bookLogId: number,
    @Body() createLogCommentDto: CreateLogCommentDto
  ) {
    return await this.bookLogService.createComment(req.user.id, {
      ...createLogCommentDto,
      bookLogId
    });
  }

  @Get('log/:id/comments')
  async getComments(
    @Req() req,
    @Param('id') bookLogId: number
  ) {
    return await this.bookLogService.getComments(bookLogId, req.user?.id);
  }

  @Delete('log/comment/:id')
  async deleteComment(
    @Req() req,
    @Param('id') commentId: number
  ) {
    return await this.bookLogService.deleteComment(req.user.id, commentId);
  }

  @Post('log/comment/:id/like')
  async toggleCommentLike(
    @Req() req,
    @Param('id') commentId: number
  ) {
    return await this.bookLogService.toggleCommentLike(req.user.id, commentId);
  }

  @Get('log/comment/:id/likes')
  async getCommentLikes(@Param('id') commentId: number) {
    return await this.bookLogService.getCommentLikes(commentId);
  }

  @Post('log/:id/like')
  async toggleBookLogLike(
    @Req() req,
    @Param('id') bookLogId: number
  ) {
    return await this.bookLogService.toggleBookLogLike(req.user.id, bookLogId);
  }

  @Get('log/:id/likes')
  async getBookLogLikes(@Param('id') bookLogId: number) {
    return await this.bookLogService.getBookLogLikes(bookLogId);
  }
}
