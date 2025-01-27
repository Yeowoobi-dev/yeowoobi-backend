import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowModule } from './follow/follow.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        DB_URL: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService]
    }),
    UserModule,
    FollowModule,
  ],
})
export class AppModule {}
