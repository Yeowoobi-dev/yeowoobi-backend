import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KakaoAuthService } from './service/kakao-auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kakaoAuthService: KakaoAuthService
  ) {}

  @Get('login-kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return {message: 'Redirecting'};
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(@Req() req) {
    console.log('kakaoAuthCallback', req.user);
    const user = await this.kakaoAuthService.validateOrCreateUser(req.user)
    const token = await this.authService.generateJwtToken(user)
    
    return {token: token};
  }
}