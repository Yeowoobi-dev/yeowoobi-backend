import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return new ResponseDto(200, true, 'Success', data === null ? '' : data);
      }),
    );
  }
} 