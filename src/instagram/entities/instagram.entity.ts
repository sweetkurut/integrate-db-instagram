import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Instagram {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  senderId: string;

  @Column()
  text: string;

  @Column()
  timestamp: string;
}
