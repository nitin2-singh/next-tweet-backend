import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post/post.entity';
import { Comment } from 'src/entities/post/comments.entity';
import { PostLike } from 'src/entities/post/likes.entity';
import { UserFollow } from 'src/entities/user/followers.entity';
import { User } from 'src/entities/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, PostLike, UserFollow, User]),
  ],
  providers: [FeedResolver, FeedService],
})
export class FeedModule {}
