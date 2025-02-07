import { Body, Controller, Get, Param, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 
   * @param req 
   * @param nickname 
   * @returns 
   * 변경된 유저 닉네임 반환
   */
  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  async generateNickname(@Req() req, @Body('nickname') nickname: string) {
    
    const newNickname =  await this.userService.createNickname(req.user.userId, nickname);

    return { nickname: newNickname }
  }
}
