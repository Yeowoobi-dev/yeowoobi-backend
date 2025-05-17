import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { PostComment } from './post-comment.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
@Unique(['userId', 'comment']) // 한 유저가 같은 댓글에 여러 번 좋아요 못 누르게
export class CommentLike extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => PostComment, { onDelete: 'CASCADE' })
  comment: PostComment;
}