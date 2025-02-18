import { Module } from "@nestjs/common";
import { UserModule } from './user/user.module';
import { BookLogModule } from './book-log/book-log.module';

@Module({
  imports: [UserModule, BookLogModule]
})
export class AppModule {}