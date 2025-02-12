import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import { FollowDto } from './dto/follow.dto';

@Controller('users')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  /**
   * 
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
  // 언팔로우
  @Delete('follow/:targetUserId')
  @UseGuards(AuthGuard('jwt'))
  async unfollow(@Req() req, @Param('targetUserId') targetUserId:string) {
    const currentUserId = req.user.userId;
    await this.followService.unfollowUser(currentUserId, targetUserId);
    
    return { text: '언팔로우 성공'}
  }

  // 팔로잉 목록 조회

  // 팔로워 목록 조회
}
