import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserResponseDto } from 'src/dtos/user/user-response.dto';
import { CreateUserDto, LoginUserDto } from 'src/dtos/user/create-user.dto';
import { CurrentUser, JwtUser } from 'src/decorator/current-user.decorator';
import { Public } from 'src/decorator/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserResponseDto)
  profile(@CurrentUser() user: JwtUser) {
    return this.authService.profile(user.id);
  }

  @Public()
  @Mutation(() => UserResponseDto)
  signup(
    @Args('input')
    input: CreateUserDto,
  ) {
    return this.authService.signup(input);
  }

  @Public()
  @Mutation(() => UserResponseDto)
  login(
    @Args('input')
    input: LoginUserDto,
  ) {
    return this.authService.login(input);
  }
}
