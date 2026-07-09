import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { AUTH_PATTERNS } from '@app/contracts/constants/patterns';
import { AuthResponse } from '@app/contracts/types/auth.types';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthHttpController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto): Promise<AuthResponse> {
    return firstValueFrom(
      this.authClient
        .send<AuthResponse, RegisterRequestDto>(AUTH_PATTERNS.REGISTER, body)
        .pipe(timeout(5000)),
    );
  }

  @Post('login')
  login(@Body() body: LoginRequestDto): Promise<AuthResponse> {
    return firstValueFrom(
      this.authClient
        .send<AuthResponse, LoginRequestDto>(AUTH_PATTERNS.LOGIN, body)
        .pipe(timeout(5000)),
    );
  }
}
