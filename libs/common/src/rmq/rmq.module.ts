import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

type RmqClientOptions = {
  name: string;
  queueEnv: string;
};

@Module({})
export class RmqModule {
  static registerClient(options: RmqClientOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: options.name,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [config.getOrThrow<string>('RMQ_URL')],
                queue: config.getOrThrow<string>(options.queueEnv),
                queueOptions: {
                  durable: true,
                },
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
