import { IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveBookLogDto {
  @ApiProperty({ description: '독서 기록 제목' })
  @IsString()
  logTitle: string;

  @ApiProperty({ description: '독서 기록 내용' })
  @IsString()
  text: string;

  @ApiProperty({ description: '카테고리' })
  category: string;

  @ApiProperty({ description: '도서 제목' })
  @IsString()
  bookTitle: string;

  @ApiProperty({ description: '도서 이미지 URL' })
  @IsString()
  @IsUrl()
  bookImage: string;

  @ApiProperty({ description: '저자' })
  @IsString()
  author: string;

  @ApiProperty({ description: '출판사' })
  @IsString()
  publisher: string;
}
