import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'apps/inventory/src/generated/prisma/client';

@Injectable()
export class InventoryPrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.getOrThrow<string>(
        'INVENTORY_DATABASE_URL',
      ),
    });
    super({ adapter });
  }
}
