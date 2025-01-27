import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Interest {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  tag: string;

  @ManyToMany(()=> User, (user)=>user.interests)
  users: User[];
}
