import { IsEmail, IsString } from "class-validator";
import { AuthUserDto } from "../../common/dto/base-authUser.dto";

export class kakaoUserDto extends AuthUserDto {
  @IsString()
  socialType: string;
  
}