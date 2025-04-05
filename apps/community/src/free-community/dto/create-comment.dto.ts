import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  parentId?: number; // 대댓글이면 부모 댓글 ID
}
