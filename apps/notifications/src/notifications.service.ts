import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('emails')
    private readonly emailQueue: Queue<SendEmailDto>,
  ) {}

  async queueEmail(dto: SendEmailDto): Promise<{ queued: boolean }> {
    await this.emailQueue.add('send-email', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    return { queued: true };
  }
}
