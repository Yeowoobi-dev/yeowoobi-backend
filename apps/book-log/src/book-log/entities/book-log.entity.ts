import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity()
export class BookLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  logTitle: string;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  review: string;

  @Column({ nullable: true })
  category: string;

  @Column()
  bookTitle: string;

  @Column({ nullable: true })
  bookImage: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({
    type: 'enum',
    enum: ['public', 'private', 'followers'],
    default: 'public'
  })
  visibility: 'public' | 'private' | 'followers';

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @VersionColumn({ nullable: true })
  version: number;
} 