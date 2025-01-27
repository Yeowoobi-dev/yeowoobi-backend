import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";
import { Interest } from "./interest.entity";

export enum gender {
  male,
  female,
  etc
}

export enum Role {
  admin,
  user,
  etc
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;  // 유저 아이디

  @Column({ unique: true })
  email: string;  // 이메일

  @Column()
  name: string; // 이름

  @Column({ unique: true})
  nickname: string; // 닉네임

  @Column()
  age: number; // 나이

  @Column({ type: 'enum', enum: gender})
  gender: string; // 성별

  @Column()
  introduce: string;  // 소개글

  @Column()
  birth: Date; // 생일

  @Column({ type: 'enum', enum: Role, default: Role.user})
  role: Role;

  @ManyToMany(()=> Interest, (interest)=>interest.users, {cascade: true})
  @JoinTable()
  interests: Interest[]; // 관심 도서 분야

  // 태그 필요(칭호 관련)
}