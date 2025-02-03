import { IsEmail, IsString } from "class-validator";

export class AuthUserDto{

  id: string;

  socialId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}