import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreatePostInput } from 'src/dtos/feed/feed.payload.dto';
import { FeedResponseDto } from 'src/dtos/feed/feed.response.dto';
import { Post } from 'src/entities/post/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  async createPost(userId: string, input: CreatePostInput) {
    const now = Math.floor(Date.now() / 1000);

    const post = this.postRepo.create({
      user_id: userId,
      content: input.content,
      created_at: now,
      updated_at: now,
    });

    await this.postRepo.save(post);

    return plainToInstance(FeedResponseDto, post);
  }

  async feed(page: number, limit: number) {
    const res = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return plainToInstance(FeedResponseDto, res);
  }
}
