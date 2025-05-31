import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('Exception caught:', exception);

    let status = 500;
    let message = '서버 내부 오류가 발생했습니다.';

    // RpcException 처리
    if (exception instanceof RpcException) {
      const error = exception.getError() as any;
      
      // NotFoundException 처리
      if (error?.name === 'NotFoundException' || 
          error?.message?.includes('not found') ||
          error?.message?.includes('찾을 수 없음')) {
        status = 404;
        message = '요청한 리소스를 찾을 수 없습니다.';
      }
      // BadRequestException 처리
      else if (error?.name === 'BadRequestException') {
        status = 400;
        message = error.message || '잘못된 요청입니다.';
      }
      // ConflictException 처리
      else if (error?.name === 'ConflictException') {
        status = 409;
        message = error.message || '이미 존재하는 리소스입니다.';
      }
      // UnauthorizedException 처리
      else if (error?.name === 'UnauthorizedException') {
        status = 401;
        message = error.message || '인증이 필요합니다.';
      }
      // ForbiddenException 처리
      else if (error?.name === 'ForbiddenException') {
        status = 403;
        message = error.message || '접근이 거부되었습니다.';
      }
      // 기타 예외
      else {
        message = error?.message || '서비스 처리 중 오류가 발생했습니다.';
      }
    } 
    // HttpException 처리
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    // 연결 오류 처리
    else if (exception.code === 'ECONNREFUSED') {
      status = 503;
      message = '서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }
    // 기타 예외 처리
    else {
      console.error('Unhandled exception:', exception);
      message = exception?.message || '서버 내부 오류가 발생했습니다.';
    }

    response.status(status).json({
      status,
      success: false,
      message,
      timestamp: new Date().toISOString(),
    });
  }
} 