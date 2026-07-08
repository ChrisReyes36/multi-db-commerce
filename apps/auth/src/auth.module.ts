import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthPrismaService } from '@app/common/prisma/auth-prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as
            number | `${number}` | `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`,
        },
      }),
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthPrismaService],
})
export class AuthModule {}
