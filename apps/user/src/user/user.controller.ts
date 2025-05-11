import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';
import { HttpExceptionFilter } from '../common/filter/exception.filter';
import { ResponseInterceptor } from '../common/interceptor/response.interceptor';
import { CreateNicknameRequest, CreateNicknameResponse } from './interfaces/user.interface';
@Controller()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateNickname')
  async createNickname(data: CreateNicknameRequest): Promise<CreateNicknameResponse> {
    const newNickname = await this.userService.createNickname(data.userId, data.nickname);
    console.log('newNickname', newNickname);
    return { nickname: newNickname };
  }


  @GrpcMethod('UserService', 'CreateIntroduce')
  async createIntroduce(data: { userId: string; introduce: string }) {
    const newIntroduce = await this.userService.createIntroduce(data.userId, data.introduce);
    return { introduce: newIntroduce };
  }

  @GrpcMethod('UserService', 'SaveInterests')
  async saveInterests(data: { userId: string; interestNames: string[] }) {
    const user = await this.userService.saveUserInterests(data.userId, data.interestNames);
    return { interests: user.interests };
  }

  @GrpcMethod('UserService', 'FindInterests')
  async findInterests(data: { userId: string }) {
    const interestNames = await this.userService.findInterests(data.userId);
    return { interestTag: interestNames };
  }
}
