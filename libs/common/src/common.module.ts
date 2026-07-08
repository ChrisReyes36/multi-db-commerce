import { Module } from '@nestjs/common';
import { RmqModule } from './rmq/rmq.module';

@Module({
  providers: [],
  exports: [],
  imports: [RmqModule],
})
export class CommonModule {}
