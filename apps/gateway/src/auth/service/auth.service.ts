import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from '../../common/dto/base-authUser.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

/**
 * jwt 토큰 생성 id, email
 * 1 시간
 */
  async generateJwtToken(user: AuthUserDto) {
    const payload = { id: user.id, 
      // email: user.email 일단 userId 만
    };
    console.log('Signing JWT with:', payload);

    return this.jwtService.sign(payload, { expiresIn: '1h' })
  }

  /**
   * jwt 검증
   */
  async verifyJwtToken(token: string) {
    return this.jwtService.verify(token, this.configService.get('JWT_SECRET'));
  }
}