import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { RmqModule } from '@app/common/rmq/rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('ORDERS_MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    RmqModule.registerClient({
      name: 'CATALOG_SERVICE',
      queueEnv: 'CATALOG_QUEUE',
    }),
    RmqModule.registerClient({
      name: 'INVENTORY_SERVICE',
      queueEnv: 'INVENTORY_QUEUE',
    }),
    RmqModule.registerClient({
      name: 'NOTIFICATIONS_SERVICE',
      queueEnv: 'NOTIFICATIONS_QUEUE',
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
