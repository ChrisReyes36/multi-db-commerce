import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

export function connectRmqMicroservice(
  app: INestApplication,
  queueEnv: string,
): void {
  const config = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: config.getOrThrow<string>(queueEnv),
      queueOptions: {
        durable: true,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });
}
