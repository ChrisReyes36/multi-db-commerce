import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendEmailDto } from '../dto/send-email.dto';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<SendEmailDto>): Promise<{ sent: boolean }> {
    const { to, subject, body } = job.data;

    console.log('Enviando correo...');
    console.log({ to, subject, body });

    return {
      sent: true,
    };
  }
}
