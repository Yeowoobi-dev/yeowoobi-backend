import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // DB 오류 코드 매핑
    let status = 500;
    let message = '데이터베이스 오류가 발생했습니다.';

    const dbError = exception as any;
    switch (dbError.code) {
      case '23505': // ✅ 중복 키 오류 (UNIQUE VIOLATION)
        status = 409;
        message = '이미 존재하는 데이터입니다.';
        break;
      default:
        status = 500;
        message = '알 수 없는 데이터베이스 오류가 발생했습니다.';
    }

    // ✅ 기존 필터 응답 포맷과 동일한 형식으로 반환
    response.status(status).json({
      status: status,
      success: false,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
