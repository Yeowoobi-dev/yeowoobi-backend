import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class UserTcpController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'findBySocialId' })
  async findBySocialId(@Payload() data: { social_id: string; social_type: string }) {
    return this.userService.findBySocialId(data.social_id, data.social_type);
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: { social_id: string; email: string; name: string; social_type: string }) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'createNickname' })
  async createNickname(@Payload() data: { userId: string; nickname: string }) {
    return this.userService.createNickname(data.userId, data.nickname);
  }

  @MessagePattern({ cmd: 'createIntroduce' })
  async createIntroduce(@Payload() data: { userId: string; introduce: string }) {
    return this.userService.createIntroduce(data.userId, data.introduce);
  }

  @MessagePattern({ cmd: 'saveInterests' })
  async saveInterests(@Payload() data: { userId: string; interestNames: string[] }) {
    return this.userService.saveInterests(data.userId, data.interestNames);
  }

  @MessagePattern({ cmd: 'findInterests' })
  async findInterests(@Payload() data: { userId: string }) {
    return this.userService.findInterests(data.userId);
  }

  @MessagePattern({ cmd: 'getUser' })
  async getUser(@Payload() data: { id: string }) {
    return this.userService.getUser(data.id);
  }

  @MessagePattern({ cmd: 'getUserName' })
  async getUserName(@Payload() data: { id: string }) {
    return this.userService.getUserName(data.id);
  }
} 