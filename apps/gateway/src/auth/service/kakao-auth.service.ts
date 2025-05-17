import { Injectable, Inject } from '@nestjs/common';
import { kakaoUserDto } from "../dto/kakao-user.dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoAuthService {
  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

  /** 
   * 사용자 검증 및 사용자 생성 
   * social ID로 따로 저장하고 
   * 기본 유저 아이디(PK)는 모든 소셜 로그인에 관계 없이 통일
  */
  async validateOrCreateUser(dto: kakaoUserDto) {
    console.log('validateOrCreateUser', dto);
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'findBySocialId' }, { 
        social_id: dto.socialId, 
        social_type: dto.socialType 
      })
    );
    
    if (user && user.id) {
      return {
        id: user.id,
        socialId: user.socialId,
        email: user.email,
        name: user.name,
        socialType: user.socialType
      };
    }

    const newUser = await firstValueFrom(
      this.userClient.send({ cmd: 'createUser' }, {
        social_id: dto.socialId,
        email: dto.email,
        name: dto.name,
        social_type: dto.socialType
      })
    );
    
    return {
      id: newUser.id,
      socialId: newUser.socialId,
      email: newUser.email,
      name: newUser.name,
      socialType: newUser.socialType
    };
  }
}