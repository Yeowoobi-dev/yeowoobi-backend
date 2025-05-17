import { IsString, IsOptional } from 'class-validator';

export class UpdateBookLogDto {
  @IsString()
  @IsOptional()
  logTitle?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  review?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  bookTitle?: string;

  @IsString()
  @IsOptional()
  bookImage?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  visibility?: 'public' | 'private' | 'followers';
} 