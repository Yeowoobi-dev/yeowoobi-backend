import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async findBySocialId(socialId: string, socialType: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'findBySocialId' }, { social_id: socialId, social_type: socialType })
    );
  }

  async createUser(data: any) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'createUser' }, data)
    );
  }

  async createNickname(data: { userId: string; nickname: string }) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'createNickname' }, data)
    );
  }

  async createIntroduce(data: { userId: string; introduce: string }) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'createIntroduce' }, data)
    );
  }

  async saveInterests(data: { userId: string; interestNames: string[] }) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'saveInterests' }, data)
    );
  }

  async findInterests(data: { userId: string }) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'findInterests' }, data)
    );
  }

  async getUser(userId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'getUser' }, { id: userId })
    );
  }

  async updateUser(id: number, updateData: any) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'updateUser' }, { id, updateData })
    );
  }

  async deleteUser(id: number) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'deleteUser' }, { id })
    );
  }

  async followUser(currentUserId: string, targetUserId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'followUser' }, { currentUserId, targetUserId })
    );
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'unfollowUser' }, { currentUserId, targetUserId })
    );
  }

  async findFollower(userId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'findFollower' }, { userId })
    );
  }

  async findFollowing(userId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'findFollowing' }, { userId })
    );
  }

  async getUserName(userId: string) {
    return firstValueFrom(
      this.userClient.send({ cmd: 'getUserName' }, { userId })
    );
  }
}
