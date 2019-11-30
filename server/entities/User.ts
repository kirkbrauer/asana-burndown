import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(type => Burndown, burndown => burndown.user)
  burndowns: Promise<Burndown[]>;

}

export default User;
