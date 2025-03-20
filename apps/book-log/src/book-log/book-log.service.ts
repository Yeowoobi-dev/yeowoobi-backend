import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { BookLog } from './entity/book-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveBookLogDto } from './dto/book-log.dto';

@Injectable()
export class BookLogService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(BookLog)
    private readonly bookLogRepository: Repository<BookLog>
  ){}
  private readonly baseUrl: string = 'https://openapi.naver.com/v1/search/book.json';


  /** 외부 api라서 나중에 따로 서비스 뺄지 고민
   * 네이버 도서 검색 api service
   * @param query 
   * @param display 
   * @param start 
   * @returns 
   */
  async searchBooks(query: string, display = 10, start = 1): Promise<any> {
    const url = `${this.baseUrl}?query=${encodeURIComponent(query)}&display=${display}&start=${start}`;
    const headers = {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.NAVER_SECRET,
    };
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      console.log(error)
      throw new HttpException(
        '네이버 도서 API 호출 실패',
        error.response?.status || 500,
      );
    }
  }

  /**
   * 
   * @param userId 
   * @param bookLog 
   * @returns 
   *  기록될 독서록 정보 반환
   */
  async saveBookInfo(userId: string, bookLog: SaveBookLogDto) {
    const result = await this.bookLogRepository.save({
      userId,
      logTitle: bookLog.logTitle,
      text: bookLog.text,
      category: bookLog.category,
      bookTitle: bookLog.bookTitle,
      bookImage: bookLog.bookImage,
      author: bookLog.author,
      publisher: bookLog.publisher,
    })
    // if (result.affected === 0){
    //   throw new NotFoundException(`User not found`);
    // }

    return { bookLog }
  };

  
}
