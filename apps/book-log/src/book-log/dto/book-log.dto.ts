import { IsString, IsUrl } from "class-validator";

export class SaveBookLogDto {

  @IsString()
  logTitle: string;

  @IsString()
  text: string;

  category: string;

  @IsString()
  bookTitle: string;

  @IsString()
  @IsUrl()
  bookImage: string;

  @IsString()
  author: string;

  @IsString()
  publisher: string;
}