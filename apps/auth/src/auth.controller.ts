import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, JwtUser } from '@app/contracts/types/auth.types';
import { LoginDto } from './dto/login.dto';
import { AUTH_PATTERNS } from '@app/contracts/constants/patterns';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() payload: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() payload: LoginDto): Promise<AuthResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_TOKEN)
  verifyToken(@Payload() token: string): Promise<JwtUser> {
    return this.authService.verifyToken(token);
  }
}
