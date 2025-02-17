import { Module } from "@nestjs/common";
import { BookLogModule } from "./book-log/book-log.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as Joi from "joi";

@Module({
  imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            HTTP_PORT: Joi.number().required(),
            DB_URL: Joi.string().required(),
          })
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h'},
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
        BookLogModule,
  ],
  controllers: [],
})
export class AppModule {}
