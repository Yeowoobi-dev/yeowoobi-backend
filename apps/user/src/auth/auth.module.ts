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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoAuthGuard, KakaoAuthService, KakaoStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
