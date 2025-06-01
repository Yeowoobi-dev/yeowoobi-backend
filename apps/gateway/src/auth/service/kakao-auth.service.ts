import { Injectable, Inject } from '@nestjs/common';
import { kakaoUserDto } from "../dto/kakao-user.dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from 'rxjs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoAuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly configService: ConfigService
  ) {}

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

  async validateOrCreateUserFromToken(accessToken: string) {
    try {
      // 카카오 API를 통해 사용자 정보 조회
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });

      const { id, kakao_account, properties } = response.data;
      
      const userDto: kakaoUserDto = {
        id: id.toString(), // 임시 ID 값
        socialId: id.toString(),
        email: kakao_account.email,
        name: properties.nickname,
        socialType: 'kakao'
      };

      return this.validateOrCreateUser(userDto);
    } catch (error) {
      console.error('Error validating Kakao token:', error);
      throw new Error('Invalid Kakao access token');
    }
  }
}