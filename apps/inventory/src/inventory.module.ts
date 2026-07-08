import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CommonModule } from '@app/common';
import { InventoryPrismaService } from '@app/common/prisma/inventory-prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CommonModule],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryPrismaService],
})
export class InventoryModule {}
