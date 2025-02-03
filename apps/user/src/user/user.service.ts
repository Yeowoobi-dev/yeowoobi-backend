import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  /**
   * 
   * @param socialId 
   * @param socialType 
   * 소셜 아이디와 소셜 타입으로 사용자 확인
   */
  async findBySocialId(socialId: string, socialType: string) {
    const user = await this.userRepository.findOne({
      where: { socialId, socialType }
    });
    if (!user) {
      const user = null;
    }
    return user;
  }
  /**
   * 
   * @param createUserDto 
   * email, name, socialID 로 유저 생성
   * user의 id 는 자동생성 값 사용
   * social(카톡) 에서 nickname 을 받아 name 으로 사용
   * 추후에 변경 예정
   */
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    const saveUser = await this.userRepository.save(user);

    return user;
  }
}
