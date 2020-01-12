import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import Burndown from './Burndown';

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  providerId: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToMany(type => Burndown, burndown => burndown.users)
  burndowns: Promise<Burndown[]>;

}

export default User;
