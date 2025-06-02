import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BookLog } from './book-log.entity';
import { BaseTable } from '../../common/entity/base-table.entity';
import { LogCommentLike } from './log-comment-like.entity';

@Entity()
export class LogComment extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; 

  @Column('text')
  content: string;

  @Column({ nullable: true })
  parentId: number; // 대댓글이면 상위 댓글 ID, 최상위 댓글이면 null

  @Column({ default: 0 })
  level: number; // 계층 깊이 (0 = 댓글, 1+ = 대댓글)

  @ManyToOne(() => BookLog, (bookLog) => bookLog.id, { onDelete: 'CASCADE' })
  bookLog: BookLog;

  @Column({ default: 0 })
  likesCount: number;

  @OneToMany(() => LogCommentLike, (like) => like.comment)
  likes: LogCommentLike[];
}
