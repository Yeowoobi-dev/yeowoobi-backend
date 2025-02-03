import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      clientSecret: configService.get('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get('KAKAO_REDIRECT_URI'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      console.log(profile);
      const { _json } = profile;
      const user = {
        socialId: _json.id,
        email: _json.kakao_account.email,
        name: _json.properties.nickname,
      };
      done(null, user);
    }
    catch (error) {
      done(error)
    }
    
  }
} 