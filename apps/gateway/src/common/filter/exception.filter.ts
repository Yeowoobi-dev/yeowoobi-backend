import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse();

    // NotFoundException인 경우 메시지 처리
    if (exception instanceof NotFoundException) {
      return response.status(status).json({
        status: status,
        success: false,
        message: '요청한 리소스를 찾을 수 없습니다.',
        timestamp: new Date().toISOString(),
      });
    }

    // 일반적인 HttpException 처리
    response.status(status).json({
      status: status,
      success: false,
      message: typeof error === 'string' ? error : error['message'],
      timestamp: new Date().toISOString(),
    });
  }
} 