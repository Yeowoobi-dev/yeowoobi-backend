import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer"

export class BaseTable {
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}