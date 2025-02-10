import { Body, Controller, Get, Param, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNicknameDto } from './dto/create-nickname.dto';
import { CreateIntroduceDto } from './dto/create-introduce.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 닉네임 생성
   * @param req 
   * @param dto 
   * @returns 
   * 변경된 유저 닉네임 반환
   */
  @Post('nickname')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async generateNickname(@Req() req, @Body() dto: CreateNicknameDto) {
    const newNickname =  await this.userService.createNickname(req.user.userId, dto.nickname);

    return { nickname: newNickname };
  }

  /**
   * 유저 소개 생성
   * @param req 
   * @param dto
   * @returns 
   * 유저 소개 반환
   */
  @Post('introduce')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async generateIntroduce(@Req() req, @Body() dto: CreateIntroduceDto) {
    const newIntroduce = await this.userService.createIntroduce(req.user.userId, dto.introduce);

    return { introduce: newIntroduce };
  }
}
