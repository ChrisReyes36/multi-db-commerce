import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { appValidationPipe } from '@app/common/pipes/app-validation.pipe';
import { RmqGlobalExceptionFilter } from '@app/common/filters/rpc-exception.filter';
import { connectRmqMicroservice } from '@app/common/rmq/rmq-server';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);

  app.useGlobalPipes(appValidationPipe);
  app.useGlobalFilters(new RmqGlobalExceptionFilter());

  connectRmqMicroservice(app, 'INVENTORY_QUEUE');

  await app.startAllMicroservices();
}
void bootstrap();
