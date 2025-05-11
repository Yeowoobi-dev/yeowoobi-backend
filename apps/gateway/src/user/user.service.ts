import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { UserServiceClient, CreateNicknameRequest, CreateNicknameResponse } from './interfaces/user.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private userService: UserServiceClient;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async findBySocialId(socialId: string, socialType: string) {
    return lastValueFrom(this.userService.findBySocialId({ social_id: socialId, social_type: socialType }));
  }

  async createUser(data: { social_id: string; email: string; name: string; social_type: string }) {
    return lastValueFrom(this.userService.createUser(data));
  }

  async createNickname(data: CreateNicknameRequest): Promise<CreateNicknameResponse> {
    console.log('1차 data', data);
    const result = await lastValueFrom(this.userService.createNickname(data));
    console.log('2차 result', result);
    return { nickname: result.nickname };
  }

  async createIntroduce(data: { userId: string; introduce: string }) {
    return lastValueFrom(this.userService.createIntroduce(data));
  }

  async saveInterests(data: { userId: string; interestNames: string[] }) {
    return lastValueFrom(this.userService.saveInterests(data));
  } 

  async findInterests(data: { userId: string }) {
    return lastValueFrom(this.userService.findInterests(data));
  }
}
