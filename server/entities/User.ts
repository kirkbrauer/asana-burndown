import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

}

export default User;
