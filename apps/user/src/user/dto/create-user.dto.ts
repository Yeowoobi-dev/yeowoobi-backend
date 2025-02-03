import { IsEmail, IsString } from "class-validator";
import { AuthUserDto } from "../../common/dto/base-authUser.dto";

export class CreateUserDto {

  socialId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  socialType: string;
}