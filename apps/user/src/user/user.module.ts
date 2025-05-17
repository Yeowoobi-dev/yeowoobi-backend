import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Interest } from './entity/interest.entity';
import { UserTcpController } from './user.tcp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Interest
    ]),
  ],
  controllers: [UserTcpController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
