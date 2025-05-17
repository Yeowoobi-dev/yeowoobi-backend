import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
export class PostComment extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // MSA라 유저 ID만 저장

  @Column('text')
  content: string;

  @Column({ nullable: true })
  parentId: number; // 대댓글이면 상위 댓글 ID, 최상위 댓글이면 null

  @Column({ default: 0 })
  level: number; // 계층 깊이 (0 = 댓글, 1+ = 대댓글)

  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ default: 0 })
  likesCount: number;
}