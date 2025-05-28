import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";

@Entity()
export class BookLog extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Column({ nullable: true })
  logTitle: string;

  @Column({type: "text", nullable: true})
  text: string;

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
}