import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { appValidationPipe } from '@app/common/pipes/app-validation.pipe';
import { RmqGlobalExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { connectRmqMicroservice } from '@app/common/rmq/rmq-server';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.useGlobalPipes(appValidationPipe);
  app.useGlobalFilters(new RmqGlobalExceptionFilter());

  connectRmqMicroservice(app, 'ORDERS_QUEUE');

  await app.startAllMicroservices();
}
bootstrap();
