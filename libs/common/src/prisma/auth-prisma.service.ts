import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'apps/auth/src/generated/prisma/client';

@Injectable()
export class AuthPrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.getOrThrow<string>('AUTH_DATABASE_URL'),
    });
    super({ adapter });
  }
}
