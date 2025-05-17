import { IsEmail, IsString } from "class-validator";
import { AuthUserDto } from "../../common/dto/base-authUser.dto";

export class CreateUserDto {

  social_id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  social_type: string;
}