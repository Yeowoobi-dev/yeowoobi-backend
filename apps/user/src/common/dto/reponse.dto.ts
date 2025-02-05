// src/common/response/response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty()
  data: T | null;

  constructor(status: number, message: string, data: T | null = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
