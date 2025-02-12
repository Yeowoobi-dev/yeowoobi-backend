import { IsDefined, IsUUID } from "class-validator";

export class FollowDto {
  @IsDefined({message: '필드 값이 잘못되었습니다.'})
  @IsUUID('all', {message: 'userId 는 유효한 UUID 형식이어야 합니다.'})
  targetUserId: string;
}