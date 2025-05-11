import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindBySocialId')
  async findBySocialId(data: { social_id: string; social_type: string }) {
    const user = await this.userService.findBySocialId(data.social_id, data.social_type);
    if (!user) {
      return {
        id: null,
        email: null,
        name: null,
      };
    }
    return user;
  }

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: { social_id: string; email: string; name: string; social_type: string }) {
    return this.userService.createUser(data);
  }

  @GrpcMethod('UserService', 'ValidateOrCreateUser')
  async validateOrCreateUser(data: { social_id: string; email: string; name: string; social_type: string }) {
    let user = await this.userService.findBySocialId(data.social_id, data.social_type);

    if (!user) {
      user = await this.userService.createUser(data);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

} 