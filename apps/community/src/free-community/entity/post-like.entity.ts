import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
@Unique(['userId', 'post'])
export class PostLike extends BaseTable{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // 유저 ID만 저장 (UUID)

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}