import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '@app/contracts/types/auth.types';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: JwtUser;
};

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext): JwtUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
