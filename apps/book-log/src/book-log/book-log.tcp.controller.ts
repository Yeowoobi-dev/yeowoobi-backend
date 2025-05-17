import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookLogService } from './book-log.service';
import { BadRequestException } from '@nestjs/common';

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
      throw error;
    }
  }
} 