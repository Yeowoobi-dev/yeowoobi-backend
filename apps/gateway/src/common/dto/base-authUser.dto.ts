import { IsEmail, IsString } from "class-validator";

export class AuthUserDto{
  @IsString()
  id: string;

  @IsString()
  socialId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}