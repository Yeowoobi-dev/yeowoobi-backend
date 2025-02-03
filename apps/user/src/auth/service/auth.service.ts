import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entity/user.entity';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { KakaoAuthService } from './kakao-auth.service';
import { NotFoundError } from 'rxjs';
import { AuthUserDto } from '../../common/dto/base-authUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

/**
 * jwt 토큰 생성 id, email
 * 1 시간
 */
  async generateJwtToken(user: AuthUserDto) {
    const payload = { id: user.id, email: user.email};
    return this.jwtService.sign(payload, { expiresIn: '1h' })
  }
}