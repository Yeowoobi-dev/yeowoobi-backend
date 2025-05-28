import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { BookLog } from './entity/book-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveBookLogDto } from './dto/book-log.dto';
import { CreateBookLogDto } from './dto/create-book-log.dto';
import { UpdateBookLogDto } from './dto/update-book-log.dto';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BookLogService {
  constructor(
    @InjectRepository(BookLog)
    private bookLogRepository: Repository<BookLog>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly baseUrl: string = 'https://openapi.naver.com/v1/search/book.json';

  async createBookLog(createBookLogDto: {
    userId: string;
    logTitle: string;
    text: string;
    review: string;
    background: string;
    bookTitle: string;
    bookImage: string;
    author: string;
    publisher: string;
    visibility: 'public' | 'private' | 'followers';
  }) {
    console.log("createBookLogDto::::::::::::::", createBookLogDto);
    const bookLog = this.bookLogRepository.create(createBookLogDto);
    console.log("bookLog::::::::::::::", bookLog);
    return await this.bookLogRepository.save(bookLog);
  }

  async getBookLog(userId: string) {
    return await this.bookLogRepository.find({ where: { userId } });
  }

  /** 외부 api라서 나중에 따로 서비스 뺄지 고민
   * 네이버 도서 검색 api service
   * @param query 
   * @param display 
   * @param start 
   * @returns 
   */
  async searchBooks(query: string, display: number = 10, start: number = 1) {
    console.log('Searching books with params:', { query, display, start });
    
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('NAVER_SECRET');
    
    console.log('Using credentials:', { 
      clientId: clientId ? 'set' : 'not set', 
      clientSecret: clientSecret ? 'set' : 'not set',
      actualClientId: clientId,
      actualClientSecret: clientSecret
    });
    
    const headers = {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    };
    
    console.log('Request headers:', headers);
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}`,
          { headers }
        ),
      );
      
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw error;
    }
  }

  async findBookLogs(userId: string) {
    return await this.bookLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
}
