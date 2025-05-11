import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Interest } from './entity/interest.entity';
import { UserGrpcController } from './user.grpc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Interest
    ]),
  ],
  controllers: [UserController, UserGrpcController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
