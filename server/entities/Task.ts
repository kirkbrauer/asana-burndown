import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import Burndown from './Burndown';

@Entity()
export class Task {
  
  @PrimaryColumn()
  id: string;

  @Column()
  taskId: string;

  @Column({ nullable: true })
  name?: String;
  
  @Column({ nullable: true })
  storyPoints?: number;

  @Column({ nullable: true })
  complete?: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt?: Date;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  modifiedAt?: Date;

  @Column({ type: 'date', nullable: true })
  dueOn?: Date;

  @Column({ nullable: true })
  hasPoints?: boolean;

  @ManyToMany(type => Burndown, burndown => burndown.tasks)
  burndowns: Promise<Burndown[]>;

}

export default Task;
