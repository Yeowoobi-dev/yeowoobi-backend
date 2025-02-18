import { Controller, Get, Post } from '@nestjs/common';
import { BookLogService } from './book-log.service';

@Controller()
export class BookLogController {
  constructor(private readonly bookLogService: BookLogService) {}

  // 도서 정보 api 조회
  
  // 독서록 작성

  // 특정 독서록 상세 조회 ?

  // 특정 독서록 수정

  // 사용자의 독서록 목록 조회(고민 : 특정 사용자 or 본인)
}
