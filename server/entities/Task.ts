import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import Burndown from './Burndown';

@Entity()
export class Task {
  
  @PrimaryColumn()
  id: string;

  @Column()
  taskId: string;

  @Column()
  name: String;
  
  @Column()
  storyPoints: number;

  @Column()
  completed: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  completedAt?: Date;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  modifiedAt?: Date;

  @Column({ type: 'date', nullable: true })
  dueOn?: Date;

  @Column()
  hasPoints: boolean;

  @ManyToMany(type => Burndown, burndown => burndown.tasks)
  burndowns: Promise<Burndown[]>;

}

export default Task;
