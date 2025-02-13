import { IsArray, IsString } from "class-validator";

export class SaveInterestsDto {
  @IsArray({ message: '관심 분야 이름 리스트는 배열이어야 합니다.' })
  @IsString({ each: true, message: '각 관심 분야 이름은 문자열이어야 합니다.' })
  interestNames: string[];
}