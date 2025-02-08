import { IsString, Length } from "class-validator";

export class createNicknameDto {
  @IsString()
  @Length(2,10)
  nickname: string;
}