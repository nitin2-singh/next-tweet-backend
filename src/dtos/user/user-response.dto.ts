import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserResponseDto {
  @Expose()
  @Field()
  id: string;

  @Expose()
  @Field()
  first_name: string;

  @Expose()
  @Field()
  last_name: string;

  @Expose()
  @Field()
  email: string;

  @Expose()
  @Field()
  access_token: string;

  @Expose()
  @Field()
  created_at: number;

  @Expose()
  @Field()
  updated_at: number;
}
