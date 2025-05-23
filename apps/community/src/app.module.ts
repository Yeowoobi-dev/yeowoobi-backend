import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";
import { HttpModule } from '@nestjs/axios';
import { FreeCommunityModule } from "./free-community/free-community.module";

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
        FreeCommunityModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
