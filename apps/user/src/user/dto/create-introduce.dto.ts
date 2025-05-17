import { IsString, Length } from "class-validator";

export class CreateIntroduceDto {
  userId: string;
  @IsString()
  @Length(3, 20)
  introduce: string;
}