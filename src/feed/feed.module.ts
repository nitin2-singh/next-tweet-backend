import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [FeedResolver, FeedService],
})
export class FeedModule {}
