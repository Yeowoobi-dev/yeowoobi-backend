import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BookLog } from './book-log.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
export class BookLogLike extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => BookLog, (bookLog) => bookLog.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  bookLog: BookLog;
} 