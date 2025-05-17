import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entity/follow.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import { FollowTcpController } from './follow.tcp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Follow,
      User,
    ]),
  ],
  controllers: [FollowController, FollowTcpController],
  providers: [FollowService],
})
export class FollowModule {}
