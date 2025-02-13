import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { UserService } from '../user/user.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { KakaoAuthService } from './service/kakao-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // 임시
      }),
    }),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoAuthGuard, KakaoAuthService, KakaoStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
