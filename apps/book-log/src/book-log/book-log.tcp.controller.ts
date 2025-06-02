import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { BookLogService } from './book-log.service';

@Controller()
export class BookLogTcpController {
  constructor(private readonly bookLogService: BookLogService) {}

  // @MessagePattern({ cmd: 'createBookLog' })
  // async createBookLog(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.userId || !data.bookId) {
  //       throw new BadRequestException('Invalid message format: userId and bookId are required');
  //     }
  //     return await this.bookLogService.createBookLog(data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @MessagePattern({ cmd: 'findBookLogs' })
  // async findBookLogs(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.userId) {
  //       throw new BadRequestException('Invalid message format: userId is required');
  //     }
  //     return await this.bookLogService.findBookLogs(data.userId);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @MessagePattern({ cmd: 'findBookLog' })
  // async findBookLog(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.id) {
  //       throw new BadRequestException('Invalid message format: id is required');
  //     }
  //     return await this.bookLogService.findBookLog(data.id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @MessagePattern({ cmd: 'updateBookLog' })
  // async updateBookLog(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.id) {
  //       throw new BadRequestException('Invalid message format: id is required');
  //     }
  //     return await this.bookLogService.updateBookLog(data.id, data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @MessagePattern({ cmd: 'deleteBookLog' })
  // async deleteBookLog(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.id) {
  //       throw new BadRequestException('Invalid message format: id is required');
  //     }
  //     return await this.bookLogService.deleteBookLog(data.id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @MessagePattern({ cmd: 'findBookLogsByBookId' })
  // async findBookLogsByBookId(@Payload() data: any) {
  //   try {
  //     if (!data || typeof data !== 'object' || !data.bookId) {
  //       throw new BadRequestException('Invalid message format: bookId is required');
  //     }
  //     return await this.bookLogService.findBookLogsByBookId(data.bookId);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @MessagePattern({ cmd: 'searchBooks' })
  async searchBooks(@Payload() data: { query: string; display?: number; start?: number }) {
    console.log('Received search request:', data);
    try {
      const result = await this.bookLogService.searchBooks(data.query, data.display, data.start);
      console.log('Search result:', result);
      return result;
    } catch (error) {
      console.error('Search error:', error);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'saveBookInfo' })
  async saveBookInfo(@Payload() data: { userId: string; bookLog: any }) {
    console.log('Received save book info request:', data);
    try {
      if (!data || typeof data !== 'object' || !data.userId || !data.bookLog) {
        throw new RpcException('Invalid message format: userId and bookLog are required');
      }
      const result = await this.bookLogService.saveBookInfo(data.userId, data.bookLog);
      console.log('Save book info result:', result);
      return result;
    } catch (error) {
      console.error('Save book info error:', error);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'createBookLog' })
  async createBookLog(@Payload() data: {
    userId: string;
    logTitle: string;
    text: string;
    review: string;
    bookTitle: string;
    bookImage: string;
    background: string;
    author: string;
    publisher: string;
    visibility: 'public' | 'private' | 'followers';
  }) {
    console.log('Received create book log request:', data);
    try {
      if (!data || typeof data !== 'object' || !data.userId || !data.logTitle) {
        throw new RpcException('Invalid message format: userId and logTitle are required');
      }
      const result = await this.bookLogService.createBookLog(data);
      console.log('Create book log result:', result);
      return result;
    } catch (error) {
      console.error('Create book log error:', error);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getBookLog' })
  async getBookLog(@Payload() data: { userId: string }) {
    try {
      return await this.bookLogService.getBookLog(data.userId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getBookLogList' })
  async getBookLogList(@Payload() data: { userId: string }) {
    try {
      return await this.bookLogService.getBookLogList(data.userId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'createComment' })
  async createComment(@Payload() data: {
    userId: string;
    bookLogId: number;
    content: string;
    parentId?: number;
  }) {
    try {
      return await this.bookLogService.createComment(data.userId, {
        bookLogId: data.bookLogId,
        content: data.content,
        parentId: data.parentId
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getComments' })
  async getComments(@Payload() data: { bookLogId: number; userId?: string }) {
    try {
      return await this.bookLogService.getComments(data.bookLogId, data.userId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'deleteComment' })
  async deleteComment(@Payload() data: { userId: string; commentId: number }) {
    try {
      return await this.bookLogService.deleteComment(data.userId, data.commentId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'toggleCommentLike' })
  async toggleCommentLike(@Payload() data: { userId: string; commentId: number }) {
    try {
      return await this.bookLogService.toggleCommentLike(data.userId, data.commentId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getCommentLikes' })
  async getCommentLikes(@Payload() data: { commentId: number }) {
    try {
      return await this.bookLogService.getCommentLikes(data.commentId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'toggleBookLogLike' })
  async toggleBookLogLike(@Payload() data: { userId: string; bookLogId: number }) {
    try {
      return await this.bookLogService.toggleBookLogLike(data.userId, data.bookLogId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'getBookLogLikes' })
  async getBookLogLikes(@Payload() data: { bookLogId: number }) {
    try {
      return await this.bookLogService.getBookLogLikes(data.bookLogId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
} 