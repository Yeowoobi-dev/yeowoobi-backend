import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { LogComment } from './log-comment.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
export class LogCommentLike extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => LogComment, (comment) => comment.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  comment: LogComment;
} 