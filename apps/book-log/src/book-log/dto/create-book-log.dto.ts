import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBookLogDto {
  @IsString()
  logTitle: string;

  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  review?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  bookTitle?: string;

  @IsString()
  @IsOptional()
  bookImage?: string;

  @IsString()
  author?: string;

  @IsString()
  publisher?: string;

  @IsString()
  @IsOptional()
  visibility?: 'public' | 'private' | 'followers';
} 