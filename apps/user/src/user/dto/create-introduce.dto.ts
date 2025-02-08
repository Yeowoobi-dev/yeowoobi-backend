import { IsString, Length } from "class-validator";

export class CreateIntroduceDto {
  @IsString()
  @Length(3, 20)
  introduce: string;
}