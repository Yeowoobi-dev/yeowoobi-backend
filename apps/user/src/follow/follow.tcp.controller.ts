import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FollowService } from './follow.service';
import { BadRequestException } from '@nestjs/common';

@Controller()
export class FollowTcpController {
  constructor(private readonly followService: FollowService) {}

  @MessagePattern({ cmd: 'followUser' })
  async followUser(@Payload() data: any) {
    try {
      if (!data || typeof data !== 'object' || !data.currentUserId || !data.targetUserId) {
        throw new BadRequestException('Invalid message format: currentUserId and targetUserId are required');
      }
      return await this.followService.followUser(data.currentUserId, data.targetUserId);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'unfollowUser' })
  async unfollowUser(@Payload() data: any) {
    try {
      if (!data || typeof data !== 'object' || !data.currentUserId || !data.targetUserId) {
        throw new BadRequestException('Invalid message format: currentUserId and targetUserId are required');
      }
      return await this.followService.unfollowUser(data.currentUserId, data.targetUserId);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'findFollower' })
  async findFollower(@Payload() data: any) {
    try {
      if (!data || typeof data !== 'object' || !data.userId) {
        throw new BadRequestException('Invalid message format: userId is required');
      }
      return await this.followService.findFollower(data.userId);
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern({ cmd: 'findFollowing' })
  async findFollowing(@Payload() data: any) {
    try {
      if (!data || typeof data !== 'object' || !data.userId) {
        throw new BadRequestException('Invalid message format: userId is required');
      }
      return await this.followService.findFollowing(data.userId);
    } catch (error) {
      throw error;
    }
  }
} 