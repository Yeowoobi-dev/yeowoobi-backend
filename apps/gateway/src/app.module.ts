import { Module } from "@nestjs/common";
import { UserModule } from './user/user.module';
import { BookLogModule } from './book-log/book-log.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthModule, UserModule, BookLogModule]
})
export class AppModule {}