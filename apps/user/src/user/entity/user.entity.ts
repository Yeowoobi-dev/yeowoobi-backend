import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";
import { Interest } from "./interest.entity";
import { Follow } from "../../follow/entity/follow.entity";

export enum SocialType {
  kakao = "kakao",
  google = "google",
  apple = "apple",
  etc = "etc"
}

export enum Gender {
  male = "male",
  female = "female",
  etc = "etc"
}

export enum Role {
  admin = "admin",
  user = "user",
  etc = "etc"
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;  // 유저 아이디

  @Column({ unique:true, nullable: true })
  socialId: string; // social 아이디

  @Column({nullable: true, type: 'enum', enum: SocialType})
  socialType: string;

  @Column({ unique: true })
  email: string;  // 이메일

  @Column()
  name: string; // 이름

  @Column({ unique: true, nullable: true})
  nickname: string; // 닉네임

  @Column({ nullable: true })
  age: number; // 나이

  @Column({ type: 'enum', enum: Gender, nullable:  true})
  gender: string; // 성별

  @Column({ nullable: true })
  introduce: string;  // 소개글

  @Column({ nullable: true })
  birth: Date; // 생일

  @Column({ type: 'enum', enum: Role, default: Role.user})
  role: Role;

  @ManyToMany(()=> Interest, (interest)=>interest.users, {cascade: true})
  @JoinTable()
  interests: Interest[]; // 관심 도서 분야

  @OneToMany(() => Follow, (follow)=> follow.follower)
  following: Follow[]; // 사용자가 팔로우한 관계

  @OneToMany(() => Follow, (follow)=> follow.following)
  followers: Follow[]; // 사용자를 팔로우한 관계

  // 태그 필요(칭호 관련)
  // 구독 엔티티 따로 필요
}