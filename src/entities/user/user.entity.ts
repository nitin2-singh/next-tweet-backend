import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserFollow } from './followers.entity';
import { Comment } from '../post/comments.entity';
import { PostLike } from '../post/likes.entity';
import { Post } from '../post/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @OneToMany(() => UserFollow, (follow) => follow.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.following)
  followers: UserFollow[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => PostLike, (like) => like.user)
  likes: PostLike[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @Column({
    type: 'bigint',
  })
  created_at: number;

  @Column({
    type: 'bigint',
  })
  updated_at: number;
}
