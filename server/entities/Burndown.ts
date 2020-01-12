import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import Task from './Task';
import User from './User';

@Entity()
export class Burndown {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  project: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @ManyToMany(type => Task, task => task.burndowns)
  @JoinTable()
  tasks: Promise<Task[]>;

  @ManyToMany(type => User, user => user.burndowns)
  @JoinTable()
  users: Promise<User[]>;

}

export default Burndown;
