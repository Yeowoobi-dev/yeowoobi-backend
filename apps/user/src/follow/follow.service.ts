import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entity/follow.entity';
import { User } from '../user/entity/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 유저 팔로우 기능
   * @param currentUserId 
   * @param targetUserId 
   * @returns
   * follow 객체 반환
   */
  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException("자기 자신은 팔로우할 수 없습니다.");
    }

    // 이미 존재하는 팔로우인지 확인
    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId }
      }
    });
    if (existingFollow) {
      throw new ConflictException("이미 해당 유저를 팔로우 중입니다.");
    }

    // 팔로우 저장
    const follow = await this.followRepository.save({
      follower: { id: currentUserId } as User,
      following: { id: targetUserId } as User,
    });

    // 유저 엔티티의 팔로잉 값 +1 
    await this.userRepository.increment({ id: targetUserId }, 'followerCount', 1);
    await this.userRepository.increment({ id: currentUserId }, 'followingCount', 1);

    return follow;
  }

  /**
   * 언팔로우 기능
   * @param currentUserId 
   * @param targetUserId 
   */
  async unfollowUser(currentUserId: string, targetUserId: string) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: currentUserId },
        following: { id: targetUserId },
      },
    });
    if (!follow) {
      throw new RpcException(new NotFoundException("팔로우 관계가 존재하지 않습니다."));
    }

    await this.followRepository.delete(follow.id);

    // 유저 엔티티의 팔로잉 값 -1 
    await this.userRepository.decrement({ id: targetUserId }, 'followerCount', 1);
    await this.userRepository.decrement({ id: currentUserId }, 'followingCount', 1);
  }

  /**
   * 팔로워 목록 조회
   * @param currentUserId 
   * @returns 
   * 팔로워 목록
   */
  async findFollower(currentUserId: string): Promise<Follow[]> {
    const follower =  await this.followRepository.find({
      where: { following: { id: currentUserId }},
      relations: ['follower'],
    });

    return follower;
  }

  /**
   * 팔로잉 목록 조회
   * @param currentUserId 
   * @returns 
   * 팔로잉 목록
   */
  async findFollowing(currentUserId: string): Promise<Follow[]> {
    const following =  await this.followRepository.find({
      where: { follower: { id: currentUserId }},
      relations: ['following'],
    });

    return following;
  }
}