import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  
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

  @Column({ nullable: true })
  accessToken?: string;

}
