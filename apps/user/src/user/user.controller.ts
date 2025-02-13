import { Body, Controller, Get, Param, Post, Headers, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateNicknameDto } from './dto/create-nickname.dto';
import { CreateIntroduceDto } from './dto/create-introduce.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SaveInterestsDto } from './dto/save-interest.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

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
  async nicknameSave(@Req() req, @Body() dto: CreateNicknameDto) {
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
  async intoduceSave(@Req() req, @Body() dto: CreateIntroduceDto) {
    const newIntroduce = await this.userService.createIntroduce(req.user.userId, dto.introduce);

    return { introduce: newIntroduce };
  }

  /**
   * 관심사 선택 
   * @param req 
   * @param dto -> 관심사 배열로 받음 ("intersetName": ["심리학", "자기계발"])
   * @returns 
   */
  @Post('interest')
  @UseGuards(AuthGuard('jwt'))
  async interestSave(@Req() req, @Body() dto: SaveInterestsDto) {
    const currentUserId = req.user.userId;
    const user = await this.userService.saveUserInterests(currentUserId, dto.interestNames);
    const interests = user.interests

    return { interests: interests}
  }

  /**
   * 관심사 조회
   * @param req 
   * @returns 
   */
  @Get('interest')
  @UseGuards(AuthGuard("jwt"))
  async interestList(@Req() req) {
    const currentUserId = req.user.userId;
    const interestNames = await this.userService.findInterests(currentUserId);

    return {interestTag: interestNames}
  }



  //////////////////////////////////////////////////////////////////
  ///////////////////////temp//////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  @Post('tempUser')
  async generateUser(@Body('email') email: string, @Body('name') name: string) {
    const user = await this.userService.createTempUser(email, name);

    return {text: '완료'};
  }

  @Post('login')
  async tempLogin(@Body('email') email: string, @Body('name') name: string) {
    const token = await this.userService.login(email, name);

    return {token: token}
  }
  //////////////////////////////////////////////////////////////////
  ///////////////////////temp//////////////////////////////////////
  //////////////////////////////////////////////////////////////////
}
