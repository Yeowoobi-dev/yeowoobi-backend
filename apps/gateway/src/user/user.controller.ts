import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
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
  async saveInterests(@Req() req, @Body() data: { interestNames: string[] }) {
    const userId = req.user.userId;
    return this.userService.saveInterests({ userId, ...data });
  }

  @Get('interests')
  @UseGuards(AuthGuard('jwt'))
  async findInterests(@Req() req) {
    const userId = req.user.userId;
    return this.userService.findInterests({ userId });
  }
}