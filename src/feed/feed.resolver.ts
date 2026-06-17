import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FeedService } from './feed.service';
import { FeedResponseDto } from 'src/dtos/feed/feed.response.dto';
import { CurrentUser, JwtUser } from 'src/decorator/current-user.decorator';
import { CreatePostInput } from 'src/dtos/feed/feed.payload.dto';

@Resolver()
export class FeedResolver {
  constructor(private readonly feedService: FeedService) {}

  @Query(() => [FeedResponseDto])
  async feed(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
  ) {
    return this.feedService.feed(page, limit);
  }

  @Mutation(() => FeedResponseDto)
  async createPost(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreatePostInput,
  ) {
    return this.feedService.createPost(user.id, input);
  }
}
