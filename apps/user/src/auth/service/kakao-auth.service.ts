import { Injectable } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { kakaoUserDto } from "../dto/kakao-user.dto";

@Injectable()
export class KakaoAuthService {
  constructor (
    private readonly userService: UserService,
  ) {}

  /** 
   * 사용자 검증 및 사용자 생성 
   * social ID로 따로 저장하고 
   * 기본 유저 아이디(PK)는 모든 소셜 로그인에 관계 없이 통일
  */
  async validateOrCreateUser(kakaoUser: kakaoUserDto) {
    const user = await this.userService.findBySocialId(kakaoUser.socialId, 'kakao');
    if (!user) {
      const createUserDto : CreateUserDto = {
        socialId: kakaoUser.socialId,
        email: kakaoUser.email,
        name: kakaoUser.name,
        socialType: 'kakao',
      }
      return await this.userService.createUser(createUserDto);
    }

    return user;
  }
}