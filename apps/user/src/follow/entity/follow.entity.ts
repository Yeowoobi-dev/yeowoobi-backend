import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";
import { User } from "../../user/entity/user.entity";

@Entity()
@Unique(['follower', 'following']) // 팔로잉와 팔로워 조합에 유니크 제약 추가
export class Follow extends BaseTable{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=> User, (user) => user.following, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'follower_id'})
  follower: User;

  @ManyToOne(()=> User, (user) => user.followers, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'following_id'})
  following: User; 
}