import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import {
  CommentResponseDto,
  FeedResponseDto,
  ToggleFollowResponseDto,
  ToggleLikeResponseDto,
} from 'src/dtos/feed/feed.response.dto';
import { CurrentUser, JwtUser } from 'src/decorator/current-user.decorator';
import {
  CreateCommentInput,
  CreatePostInput,
} from 'src/dtos/feed/feed.payload.dto';
import { UserResponseDto } from 'src/dtos/user/user-response.dto';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => [FeedResponseDto])
  async feed(
    @CurrentUser() user: JwtUser,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ) {
    return this.feedService.feed(user.id, page, limit);
  }

  @Query(() => [CommentResponseDto])
  async comments(
    @Args('post_id') postId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.feedService.comments(postId, page, limit);
  }

  @Query(() => [UserResponseDto])
  suggestedUsers(
    @CurrentUser() user: JwtUser,

    @Args('page', {
      type: () => Int,
      defaultValue: 1,
    })
    page: number,

    @Args('limit', {
      type: () => Int,
      defaultValue: 10,
    })
    limit: number,

    @Args('search', {
      type: () => String,
      nullable: true,
    })
    search?: string,
  ) {
    return this.feedService.suggestedUsers(user.id, page, limit, search);
  }

  @Mutation(() => ToggleFollowResponseDto)
  toggleFollow(
    @CurrentUser() user: JwtUser,
    @Args('followingId') followingId: string,
  ) {
    return this.feedService.toggleFollow(user.id, followingId);
  }

  @Mutation(() => ToggleLikeResponseDto)
  async togglePostLike(
    @CurrentUser() user: JwtUser,
    @Args('postId') postId: string,
  ) {
    return this.feedService.togglePostLike(user.id, postId);
  }

  @Mutation(() => CommentResponseDto)
  async createComment(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreateCommentInput,
  ) {
    return this.feedService.createComment(user.id, input);
  }

  @Mutation(() => FeedResponseDto)
  async createPost(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreatePostInput,
  ) {
    return this.feedService.createPost(user.id, input);
  }
}
