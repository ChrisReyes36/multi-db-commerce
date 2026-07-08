import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/contracts/enums/roles';
import { AuthPrismaService } from '@app/common/prisma/auth-prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, JwtUser } from '@app/contracts/types/auth.types';
import { LoginDto } from './dto/login.dto';

type AuthUserEntity = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: AuthPrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    return this.buildResponse(user as AuthUserEntity);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.buildResponse(user as AuthUserEntity);
  }

  async verifyToken(token: string): Promise<JwtUser> {
    try {
      return await this.jwtService.verifyAsync<JwtUser>(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private buildResponse(user: AuthUserEntity): AuthResponse {
    const payload: JwtUser = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
