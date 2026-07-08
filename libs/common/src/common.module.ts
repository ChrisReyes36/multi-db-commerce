import { Module } from '@nestjs/common';
import { RmqModule } from './rmq/rmq.module';
import { AuthPrismaService } from './prisma/auth-prisma.service';
import { InventoryPrismaService } from './prisma/inventory-prisma.service';

@Module({
  providers: [AuthPrismaService, InventoryPrismaService],
  exports: [AuthPrismaService, InventoryPrismaService],
  imports: [RmqModule],
})
export class CommonModule {}
