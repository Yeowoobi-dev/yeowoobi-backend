import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogCommentDto {
  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  content: string;

  @ApiProperty({ description: '부모 댓글 ID (대댓글인 경우)', required: false })
  @IsOptional()
  @IsNumber()
  parentId?: number;
} 