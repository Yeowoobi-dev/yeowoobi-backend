import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";

@Entity()
export class BookLog extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Column()
  logTitle: string;

  @Column({type: "text", nullable: true})
  text: string;

  @Column({length: 255, nullable: true})
  review: string;

  @Index()
  @Column({nullable: true})
  category: string;

  @Column()
  bookTitle: string;

  @Column()
  bookImage: string;

  @Column({length: 50})
  author: string;

  @Column({length: 50})
  publisher: string;

  @Index() // 공개 범위 필터링 최적화
  @Column({ type: "enum", enum: ["public", "private", "followers"], default: "private" })
  visibility: "public" | "private" | "followers";
}