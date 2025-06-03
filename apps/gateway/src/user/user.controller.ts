import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FollowDto } from './dto/follow.dto';
import { FollowerResponseDto } from './dto/follower-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  async createNickname(@Req() req, @Body() data: { nickname: string }) {
    const userId = req.user.userId; // JWT에서 추출한 userId

    const result = await this.userService.createNickname({ userId, ...data });
    return result;
  }

  @Post('introduce')
  @UseGuards(AuthGuard('jwt'))
  async createIntroduce(@Req() req, @Body() data: { introduce: string }) {
    const userId = req.user.userId;
    console.log(userId);
    return this.userService.createIntroduce({ userId, ...data });
  }

  @Post('interest')
  @UseGuards(AuthGuard('jwt'))
  async saveUserInterests(@Req() req, @Body() data: { interestNames: string[] }) {
    const userId = req.user.userId;
    return this.userService.saveInterests({ userId, ...data });
  }

  @Get('interests')
  @UseGuards(AuthGuard('jwt'))
  async findInterests(@Req() req) {
    const userId = req.user.userId;
    return this.userService.findInterests(userId);
  }

  @Post('follow')
  @UseGuards(AuthGuard('jwt'))
  async follow(@Req() req, @Body() targetDto: FollowDto) {
    const currentUserId = req.user.userId;
    const follow = await this.userService.followUser(currentUserId, targetDto.targetUserId);
    return { follower: follow.follower, following: follow.following };
  }

  @Delete('follow/:targetUserId')
  @UseGuards(AuthGuard('jwt'))
  async unfollow(@Req() req, @Param() params: FollowDto) {
    const currentUserId = req.user.userId;
    const { targetUserId } = params;
    await this.userService.unfollowUser(currentUserId, targetUserId);
    return { text: '언팔로우 성공' };
  }

  @Get('followers')
  @UseGuards(AuthGuard('jwt'))
  async followerList(@Req() req): Promise<{ followers: FollowerResponseDto[] }> {
    const currentUserId = req.user.userId;
    const followerRecords = await this.userService.findFollower(currentUserId);
    
    const followers = followerRecords.map(follow => ({
      id: follow.follower?.id || null,
      name: follow.follower?.name || null, 
      nickname: follow.follower?.nickname || null,
    }));

    return { followers: followers || [] };
  }

  @Get('following')
  @UseGuards(AuthGuard('jwt'))
  async followingList(@Req() req): Promise<{ followingList: FollowerResponseDto[] }> {
    const currentUserId = req.user.userId;
    const followingRecords = await this.userService.findFollowing(currentUserId);
    
    const followingList = followingRecords.map(follow => ({
      id: follow.following?.id || null,
      name: follow.following?.name || null,
      nickname: follow.following?.nickname || null,
    }));

    return { followingList: followingList || [] };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUser(userId);
  }

  @Get('/name')
  @UseGuards(AuthGuard('jwt'))
  async getUserName(@Req() req) {
    const userId = req.user.userId;
    return this.userService.getUserName(userId);
  }
}