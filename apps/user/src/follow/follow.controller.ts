import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { FollowDto } from './dto/follow.dto';
import { FollowerResponseDto } from './dto/follwer-response.dto';

@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * 팔로우
   * @param req 
   * @param targetDto => targetUserId 
   * @returns 
   */
  @Post('follow')
  @UseGuards(AuthGuard('jwt'))
  async follow(@Req() req, @Body() targetDto: FollowDto) {
    const currentUserId = req.user.userId;
    const follow = await this.followService.followUser(currentUserId, targetDto.targetUserId)

    return { follower: follow.follower, following: follow.following }
  }
  /**
   * 언팔로우
   * @param req 
   * @param params
   * @returns 
   */
  @Delete('follow/:targetUserId')
  @UseGuards(AuthGuard('jwt'))
  async unfollow(@Req() req, @Param() params: FollowDto) {
    const currentUserId = req.user.userId;
    const { targetUserId } = params
    await this.followService.unfollowUser(currentUserId, targetUserId);
    
    return { text: '언팔로우 성공'}
  }

  // 팔로워 목록 조회
  /**
   * 
   * @param req 
   * @returns 
   */
  @Get('followers')
  @UseGuards(AuthGuard('jwt'))
  async followerList(@Req() req): Promise<{ followers: FollowerResponseDto[] }> {
    const currentUserId = req.user.userId;
    const followerReocords = await this.followService.findFollower(currentUserId);
    
    const followers = followerReocords.map(follow => {
      return {
        id: follow.follower.id,
        name: follow.follower.name,
        nickname: follow.follower.nickname,
      }
    })

    return { followers }
  }

  // 팔로잉 목록 조회
  /**
   * 
   * @param req 
   * @returns 
   */
  @Get('following')
  @UseGuards(AuthGuard('jwt'))
  async followingList(@Req() req): Promise<{ followingList: FollowerResponseDto[] }> {
    const currentUserId = req.user.userId;
    const followingReocords = await this.followService.findFollowing(currentUserId);
    
    const followingList = followingReocords.map(follow => {
      return {
        id: follow.following.id,
        name: follow.following.name,
        nickname: follow.following.nickname,
      }
    })

    return { followingList }
  }
}
