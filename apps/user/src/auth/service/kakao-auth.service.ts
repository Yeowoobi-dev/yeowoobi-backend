import { Injectable } from '@nestjs/common';
import { kakaoUserDto } from "../dto/kakao-user.dto";
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class KakaoAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  /** 
   * 사용자 검증 및 사용자 생성 
   * social ID로 따로 저장하고 
   * 기본 유저 아이디(PK)는 모든 소셜 로그인에 관계 없이 통일
  */
  async validateOrCreateUser(dto: kakaoUserDto) {
    console.log('validateOrCreateUser', dto);
  
    // 1. 먼저 존재하는 유저 확인
    const existingUser = await this.userService.findBySocialId(dto.socialId, dto.socialType);
  
    if (existingUser && existingUser.id) {
      console.log('[유저 있음, 그대로 리턴]');
      return {
        id: existingUser.id,
        socialId: existingUser.socialId,
        email: existingUser.email,
        name: existingUser.name,
        socialType: existingUser.socialType
      };
    }
  
    // 2. 존재하지 않으면 생성 시도
    try {
      const newUser = await this.userService.createUser({
        social_id: dto.socialId,
        email: dto.email,
        name: dto.name,
        social_type: dto.socialType
      });
  
      return {
        id: newUser.id,
        socialId: newUser.socialId,
        email: newUser.email,
        name: newUser.name,
        socialType: newUser.socialType
      };
    } catch (error) {
      // 3. 만약 동시 요청으로 unique constraint 에러가 발생하면, 다시 유저 조회
      if (error.code === '23505') {
        const user = await this.userService.findBySocialId(dto.socialId, dto.socialType);
        if (user && user.id) {
          return {
            id: user.id,
            socialId: user.socialId,
            email: user.email,
            name: user.name,
            socialType: user.socialType
          };
        }
      }
  
      // 4. 다른 에러는 그대로 던지기
      throw error;
    }
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