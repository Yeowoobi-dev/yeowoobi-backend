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

  async createBookLog(data: {
    userId: string;
    logTitle: string;
    text: string;
    background: string;
    review: string;
    bookTitle: string;
    bookImage: string;
    author: string;
    publisher: string;
    visibility: 'public' | 'private' | 'followers';
  }) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'createBookLog' }, data)
    );
  }

  async getBookLog(userId: string) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'getBookLog' }, { userId })
    );
  }

  async getBookLogList(userId: string) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'getBookLogList' }, { userId })
    );
  }

  async createComment(userId: string, commentData: { content: string; bookLogId: number; parentId?: number }) {
    return await firstValueFrom(
      this.bookLogClient.send({ cmd: 'createComment' }, { userId, ...commentData })
    );
  }

  async getComments(bookLogId: number, userId?: string) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'getComments' }, { bookLogId, userId })
      );
    } catch (error) {
      console.error('Error in getComments:', error);
      return [];
    }
  }

  async deleteComment(userId: string, commentId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'deleteComment' }, { userId, commentId })
      );
    } catch (error) {
      console.error('Error in deleteComment:', error);
      throw error;
    }
  }

  async toggleCommentLike(userId: string, commentId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'toggleCommentLike' }, { userId, commentId })
      );
    } catch (error) {
      console.error('Error in toggleCommentLike:', error);
      throw error;
    }
  }

  async getCommentLikes(commentId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'getCommentLikes' }, { commentId })
      );
    } catch (error) {
      console.error('Error in getCommentLikes:', error);
      return [];
    }
  }

  async toggleBookLogLike(userId: string, bookLogId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'toggleBookLogLike' }, { userId, bookLogId })
      );
    } catch (error) {
      console.error('Error in toggleBookLogLike:', error);
      throw error;
    }
  }

  async getBookLogLikes(bookLogId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'getBookLogLikes' }, { bookLogId })
      );
    } catch (error) {
      console.error('Error in getBookLogLikes:', error);
      return [];
    }
  }

  async deleteBookLog(userId: string, bookLogId: number) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'deleteBookLog' }, { userId, bookLogId })
      );
    } catch (error) {
      console.error('Error in deleteBookLog:', error);
      throw error;
    }
  }

  async updateBookLog(userId: string, bookLogId: number, updateData: {
    bookTitle: string;
    author: string;
    publisher: string;
    title: string;
    background: string;
    content: string;
    review: string;
  }) {
    try {
      return await firstValueFrom(
        this.bookLogClient.send({ cmd: 'updateBookLog' }, { 
          userId, 
          bookLogId,
          bookTitle: updateData.bookTitle,
          author: updateData.author,
          publisher: updateData.publisher,
          logTitle: updateData.title,
          text: updateData.content,
          background: updateData.background,
          review: updateData.review
        })
      );
    } catch (error) {
      console.error('Error in updateBookLog:', error);
      throw error;
    }
  }
}
