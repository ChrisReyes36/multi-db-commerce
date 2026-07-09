import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthHttpController } from './auth/auth-http.controller';
import { CatalogHttpController } from './catalog/catalog-http.controller';
import { InventoryHttpController } from './inventory/inventory-http.controller';
import { OrdersHttpController } from './orders/orders-http.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.registerClient({
      name: 'AUTH_SERVICE',
      queueEnv: 'AUTH_QUEUE',
    }),
    RmqModule.registerClient({
      name: 'CATALOG_SERVICE',
      queueEnv: 'CATALOG_QUEUE',
    }),
    RmqModule.registerClient({
      name: 'ORDERS_SERVICE',
      queueEnv: 'ORDERS_QUEUE',
    }),
    RmqModule.registerClient({
      name: 'INVENTORY_SERVICE',
      queueEnv: 'INVENTORY_QUEUE',
    }),
  ],
  controllers: [
    AuthHttpController,
    CatalogHttpController,
    InventoryHttpController,
    OrdersHttpController,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class ApiGatewayModule {}
