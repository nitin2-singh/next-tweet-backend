import { Field, ID, ObjectType } from '@nestjs/graphql';
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
}
