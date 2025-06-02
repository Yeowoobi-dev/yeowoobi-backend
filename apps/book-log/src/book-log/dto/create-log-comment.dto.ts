import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLogCommentDto {
  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsNumber()
  bookLogId: number;
} 