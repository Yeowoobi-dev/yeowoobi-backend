import { Injectable, Inject } from '@nestjs/common';
import { kakaoUserDto } from "../dto/kakao-user.dto";
import { ClientGrpc } from "@nestjs/microservices";
import { UserServiceClient } from "../../user/interfaces/user.interface";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoAuthService {
  private userService: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  /** 
   * 사용자 검증 및 사용자 생성 
   * social ID로 따로 저장하고 
   * 기본 유저 아이디(PK)는 모든 소셜 로그인에 관계 없이 통일
  */
  async validateOrCreateUser(dto: kakaoUserDto) {
    const user = await firstValueFrom(this.userService.findBySocialId({ 
      social_id: dto.socialId, 
      social_type: dto.socialType 
    }));
    
    if (user && user.id) {
      return {
        id: user.id,
        socialId: user.social_id,
        email: user.email,
        name: user.name,
        socialType: user.social_type
      };
    }else {
    
      const newUser = await firstValueFrom(this.userService.createUser({
        social_id: dto.socialId,
        email: dto.email,
        name: dto.name,
        social_type: dto.socialType
      }));
      
      return {
        id: newUser.id,
        socialId: newUser.social_id,
        email: newUser.email,
        name: newUser.name,
        socialType: newUser.social_type
      };
    }
  }
}