import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
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
    let message = '서비스 연결 중 오류가 발생했습니다.';

    if (exception instanceof RpcException) {
      const error = exception.getError() as any;
      status = error?.status || 500;
      message = error?.message || '마이크로서비스 통신 중 오류가 발생했습니다.';
    } else if (exception.code === 'ECONNREFUSED') {
      status = 503;
      message = '서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
    }

    response.status(status).json({
      status: status,
      success: false,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
} 