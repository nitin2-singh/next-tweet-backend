import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class FeedResponseDto {
  @Field(() => ID)
  @Expose()
  id: string;

  @Expose()
  @Field()
  content: string;

  @Expose()
  @Field()
  created_at: number;

  @Expose()
  @Field()
  owner_id: string;

  @Expose()
  @Field()
  first_name: string;

  @Expose()
  @Field()
  last_name: string;

  @Expose()
  @Field()
  like_count: number;

  @Field()
  is_following: boolean;

  @Field()
  is_liked: boolean;

  @Expose()
  @Field()
  comment_count: number;
}

@ObjectType()
export class ToggleFollowResponseDto {
  @Field()
  following: boolean;
}

@ObjectType()
export class CommentResponseDto {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  created_at: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;
}

@ObjectType()
export class ToggleLikeResponseDto {
  @Field()
  liked: boolean;

  @Field(() => Int)
  like_count: number;
}
