import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common/rmq/rmq.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

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
  ],
  controllers: [],
  providers: [JwtAuthGuard, RolesGuard],
})
export class ApiGatewayModule {}
