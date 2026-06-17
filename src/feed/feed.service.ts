import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  CreateCommentInput,
  CreatePostInput,
} from 'src/dtos/feed/feed.payload.dto';
import {
  CommentResponseDto,
  FeedResponseDto,
  ToggleFollowResponseDto,
  ToggleLikeResponseDto,
} from 'src/dtos/feed/feed.response.dto';
import { UserResponseDto } from 'src/dtos/user/user-response.dto';
import { Comment } from 'src/entities/post/comments.entity';
import { PostLike } from 'src/entities/post/likes.entity';
import { Post } from 'src/entities/post/post.entity';
import { UserFollow } from 'src/entities/user/followers.entity';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(PostLike)
    private readonly likeRepo: Repository<PostLike>,

    @InjectRepository(UserFollow)
    private readonly followRepo: Repository<UserFollow>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async createComment(userId: string, input: CreateCommentInput) {
    const now = Math.floor(Date.now() / 1000);

    const comment = this.commentRepo.create({
      user_id: userId,
      post_id: input.post_id,
      comment: input.content,
      created_at: now,
      updated_at: now,
    });

    await this.commentRepo.save(comment);

    const result = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id: comment.id })
      .getOneOrFail();

    const res = {
      id: result.id,
      content: result.comment,
      created_at: result.created_at,
      first_name: result.user.first_name,
      last_name: result.user.last_name,
    };
    return plainToInstance(CommentResponseDto, res);
  }

  async togglePostLike(userId: string, postId: string) {
    const existing = await this.likeRepo.findOne({
      where: {
        user_id: userId,
        post_id: postId,
      },
    });

    if (existing) {
      await this.likeRepo.remove(existing);

      const like_count = await this.likeRepo.count({
        where: {
          post_id: postId,
        },
      });

      return {
        liked: false,
        like_count,
      };
    }

    const like = this.likeRepo.create({
      user_id: userId,
      post_id: postId,
      created_at: Math.floor(Date.now() / 1000),
    });

    await this.likeRepo.save(like);

    const like_count = await this.likeRepo.count({
      where: {
        post_id: postId,
      },
    });

    return plainToInstance(ToggleLikeResponseDto, {
      liked: true,
      like_count,
    });
  }

  async toggleFollow(followerId: string, followingId: string) {
    const existing = await this.followRepo.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });

    if (existing) {
      await this.followRepo.remove(existing);

      return {
        following: false,
      };
    }

    const follow = this.followRepo.create({
      follower_id: followerId,
      following_id: followingId,
      created_at: Math.floor(Date.now() / 1000),
    });

    await this.followRepo.save(follow);

    return plainToInstance(ToggleFollowResponseDto, {
      following: true,
    });
  }

  async suggestedUsers(
    currentUserId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoin(
        UserFollow,
        'follow',
        `"follow"."following_id" = "user"."id"
   AND "follow"."follower_id" = :currentUserId`,
        {
          currentUserId,
        },
      )
      .where('user.id != :currentUserId', {
        currentUserId,
      });

    if (search?.trim()) {
      query.andWhere(
        `
LOWER(CONCAT("user"."first_name", ' ', "user"."last_name"))
LIKE LOWER(:search)
`,
        {
          search: `%${search}%`,
        },
      );
    }

    const users: {
      user_id: string;
      user_first_name: string;
      user_last_name: string;
      is_following: boolean;
    }[] = await query
      .select(['user.id', 'user.first_name', 'user.last_name'])
      .addSelect(
        'CASE WHEN follow.id IS NULL THEN false ELSE true END',
        'is_following',
      )
      .orderBy('user.first_name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    return plainToInstance(
      UserResponseDto,
      users.map((u) => ({
        id: u.user_id,
        first_name: u.user_first_name,
        last_name: u.user_last_name,
        is_following: u.is_following,
      })),
    );
  }

  async feed(userId: string, page: number, limit: number) {
    const { raw, entities } = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoin('post.likes', 'likes')
      .leftJoin('post.comments', 'comments')

      // current user's follow
      .leftJoin(
        UserFollow,
        'follow',
        'follow.following_id = user.id AND follow.follower_id = :userId',
        { userId },
      )

      // current user's like
      .leftJoin(
        PostLike,
        'viewer_like',
        'viewer_like.post_id = post.id AND viewer_like.user_id = :userId',
        { userId },
      )

      .select(['post', 'user'])

      .addSelect('COUNT(DISTINCT likes.id)', 'like_count')
      .addSelect('COUNT(DISTINCT comments.id)', 'comment_count')

      .addSelect(
        'CASE WHEN follow.id IS NULL THEN false ELSE true END',
        'is_following',
      )

      .addSelect(
        'CASE WHEN viewer_like.id IS NULL THEN false ELSE true END',
        'is_liked',
      )

      .groupBy('post.id')
      .addGroupBy('user.id')
      .addGroupBy('follow.id')
      .addGroupBy('viewer_like.id')

      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

      .getRawAndEntities();

    const rows = raw as Array<{
      like_count: string;
      comment_count: string;
      is_following: boolean;
      is_liked: boolean;
    }>;

    const data = entities.map((post, index) => ({
      id: post.id,
      content: post.content,
      created_at: post.created_at,

      first_name: post.user.first_name,
      last_name: post.user.last_name,
      owner_id: post.user.id,

      like_count: Number(rows[index].like_count),
      comment_count: Number(rows[index].comment_count),

      is_following: Boolean(rows[index].is_following),
      is_liked: Boolean(rows[index].is_liked),
    }));

    return plainToInstance(FeedResponseDto, data);
  }

  async comments(postId: string, page: number, limit: number) {
    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post_id = :postId', { postId })
      .select(['comment', 'user'])
      .orderBy('comment.created_at', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const data = comments.map((comment) => ({
      id: comment.id,
      content: comment.comment,
      created_at: comment.created_at,
      first_name: comment.user.first_name,
      last_name: comment.user.last_name,
    }));
    return plainToInstance(CommentResponseDto, data);
  }
}
