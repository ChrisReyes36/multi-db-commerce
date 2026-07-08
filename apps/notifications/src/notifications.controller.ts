import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NOTIFICATION_PATTERNS } from '@app/contracts/constants/patterns';
import { SendEmailDto } from './dto/send-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(NOTIFICATION_PATTERNS.SEND_EMAIL)
  sendEmail(@Payload() payload: SendEmailDto): Promise<{ queued: boolean }> {
    return this.notificationsService.queueEmail(payload);
  }
}
