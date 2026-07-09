import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom, timeout } from 'rxjs';
import { AUTH_PATTERNS } from '@app/contracts/constants/patterns';
import { JwtUser } from '@app/contracts/types/auth.types';

type AuthenticatedRequest = Request & {
  user?: JwtUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token requerido');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const user = await firstValueFrom(
      this.authClient
        .send<JwtUser, string>(AUTH_PATTERNS.VERIFY_TOKEN, token)
        .pipe(timeout(5000)),
    );

    request.user = user;

    return true;
  }
}
