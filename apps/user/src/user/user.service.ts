import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Auth, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { when } from 'joi';
import { Interest } from './entity/interest.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Interest)
    private readonly interestRepository: Repository<Interest>,
  ) {}
  /**
   * socialId 로 사용자 확인 메소드
   * @param socialId 
   * @param socialType 
   * 소셜 아이디와 소셜 타입으로 사용자 확인
   */
  async findBySocialId(socialId: string, socialType: string) {
    
    const user = await this.userRepository.findOne({
      where: {
        socialId
      }
    });
    console.log("findBySocialId", user);
    return user;
  }
  /**
   * 유저 생성 메소드
   * @param createUserDto 
   * email, name, socialID 로 유저 생성
   * user의 id 는 자동생성 값 사용
   * social(카톡) 에서 nickname 을 받아 name 으로 사용
   * 추후에 변경 예정
   */
  async createUser(data: { social_id: string; email: string; name: string; social_type: string }) {
    try {
      // 먼저 기존 사용자 확인
      const existingUser = await this.findBySocialId(data.social_id, data.social_type);
      if (existingUser) {
        return existingUser;
      }

      const user = this.userRepository.create({
        socialId: data.social_id,
        email: data.email,
        name: data.name,
        socialType: data.social_type
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique_violation
        // 중복 키 에러 발생 시 다시 한번 조회
        const existingUser = await this.findBySocialId(data.social_id, data.social_type);
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }
  /**
   * 닉네임 변경 메소드
   * @param token 
   * @param nickname 
   * @returns 
   * 닉네임이 변경된 사용자의 닉네임
   */
  async createNickname(userId: string, nickname: string) {
    const result = await this.userRepository.update({ id: userId }, { nickname: nickname})
    if (result.affected === 0){
      throw new NotFoundException(`User not found`);
    }
    // 중복은 디비에서 알아서 잡아줌 에러핸들러로 응답 통일했음
    return nickname; // affected 0일 때 걸러지기 때문에 그냥 입력값 그대로 반환해도 괜찮음
  } 

  /**
   * 사용자 소개글 작성 메소드
   * @param userId 
   * @param introduce 
   * @returns 
   * 생성된 사용자 소개 반환
   */
  async createIntroduce(userId: string, introduce: string) {
    // findOne, save 에서 update로 로직 변경
    const result = await this.userRepository.update({ id: userId }, { introduce: introduce });
    if (result.affected === 0) {
      throw new NotFoundException(`User not found`);
    }
    return introduce;
  }

  /**
   * 관심 분야 선택
   * @param currentUserId 
   * @param interestName 
   * @returns
   *  
   */
  async saveInterests(currentUserId: string, interestName: string[]) {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['interests']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 관심사 레포지토리에서 관심사 조회 및 생성
    const interests = [];
    for (const name of interestName) {
      let interest = await this.interestRepository.findOne({
        where: { tag: name }
      });
      
      if (!interest) {
        interest = this.interestRepository.create({ tag: name });
        interest = await this.interestRepository.save(interest);
      }
      interests.push(interest);
    }

    user.interests = interests;
    return await this.userRepository.save(user);
  }

  /**
   * 관심사 조회
   * @param currentUserId 
   * @returns 
   * 유저 관심사 tag 반환
   */
  async findInterests(currentUserId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUserId
      },
      relations: ['interests'],
    });
    if (!user) {
      throw new NotFoundException("User not Found");
    }

    return user.interests.map(interest => interest.tag);
  }

  async getUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId }
      });
      
      if (!user) {
        console.error(`User not found for id: ${userId}`);
        return { nickname: '알 수 없음' };
      }
      
      return {
        id: user.id,
        name: user.name,
        introduce: user.introduce,
        nickname: user.nickname,
        interests: user.interests.map(interest => interest.tag)
      };
    } catch (error) {
      console.error('Error in getUser:', error);
      return { nickname: '알 수 없음' };
    }
  }

  async getUserName(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    return user.name;
  }
}
