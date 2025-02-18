// src/common/response/response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 200 })
  status: number;
  
  @ApiProperty({example: true})
  success: boolean

  @ApiProperty({ example: 'ok' })
  message: string;

  @ApiProperty()
  data: T | null;

  constructor(status: number, success: boolean, message: string, data: T | null = null) {
    this.status = status;
    this.success = success
    this.message = message;
    this.data = data;
  }
}
