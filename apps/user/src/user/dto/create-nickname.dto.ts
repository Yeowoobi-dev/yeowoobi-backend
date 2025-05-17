import { IsString, Length } from "class-validator";

export class CreateNicknameDto {
  userId: string;
  @IsString()
  @Length(2,10)
  nickname: string;
}