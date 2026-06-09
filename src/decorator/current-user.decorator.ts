import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtUser {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser => {
    const gqlContext = GqlExecutionContext.create(context);

    return gqlContext.getContext<{
      req: {
        user: JwtUser;
      };
    }>().req.user;
  },
);
