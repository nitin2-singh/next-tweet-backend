import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_follows')
@Unique(['follower_id', 'following_id'])
export class UserFollow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // User who follows
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Column()
  follower_id: string;

  // User being followed
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: User;

  @Column()
  following_id: string;

  @Column({
    type: 'bigint',
  })
  created_at: number;
}
