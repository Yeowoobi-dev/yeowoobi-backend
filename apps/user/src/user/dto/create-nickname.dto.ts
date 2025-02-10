import { IsString, Length } from "class-validator";

export class CreateNicknameDto {
  @IsString()
  @Length(2,10)
  nickname: string;
}