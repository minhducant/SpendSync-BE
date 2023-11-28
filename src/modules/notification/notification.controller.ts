import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NotificationService } from './notification.service';

@ApiTags('Notification - Thông báo')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
}
