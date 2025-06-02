import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";
import { LogComment } from "./log-comment.entity";
import { BookLogLike } from "./book-log-like.entity";

@Entity()
export class BookLog extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Column({ nullable: true })
  logTitle: string;

  @Column({ type: 'jsonb', nullable: true })
  text: any;

  @Column({type: "text", nullable: true})
  background: string;

  @Column({length: 255, nullable: true})
  review: string;

  @Index()
  @Column({nullable: true})
  category: string;

  @Column({ nullable: true })
  bookTitle: string;

  @Column({ nullable: true })
  bookImage: string;

  @Column({length: 50, nullable: true})
  author: string;

  @Column({length: 50, nullable: true})
  publisher: string;

  @Index() // 공개 범위 필터링 최적화
  @Column({ type: "enum", enum: ["public", "private", "followers"], default: "private" })
  visibility: "public" | "private" | "followers";

  @OneToMany(() => LogComment, (comment) => comment.bookLog)
  comments: LogComment[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @OneToMany(() => BookLogLike, (like) => like.bookLog)
  likes: BookLogLike[];
}