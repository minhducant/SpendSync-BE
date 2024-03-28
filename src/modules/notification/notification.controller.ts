import { DecodedIdToken } from 'firebase-admin/auth';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Notification } from './schemas/notification.schema';
import { NotificationService } from './notification.service';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetNotificationDto } from './dto/get-notifications.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { RegisterNotificationDto } from './dto/register-notification.dto';

@ApiTags('Notification - Thông báo')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Notification] Get notifications' })
  async getNotifications(
    @UserID() user_id: string,
    @Query() query: GetNotificationDto,
  ): Promise<ResPagingDto<Notification[]>> {
    return this.notificationService.getNotifications(query, user_id);
  }

  @Post('/push')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Notification] Push notification' })
  async pushNotification(
    @Body() SendNotificationDto: SendNotificationDto,
  ): Promise<void> {
    return this.notificationService.sendNotification(SendNotificationDto);
  }

  @Post('/register')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Notification] Register notification' })
  async registerNotification(
    @UserID() user_id: string,
    @Body() RegisterNotificationDto: RegisterNotificationDto,
  ): Promise<void> {
    return this.notificationService.registerNotification(
      user_id,
      RegisterNotificationDto,
    );
  }

  // @Post('/verify_token')
  // @ApiOperation({ summary: '[ Notification ] Verify Firebase Token' })
  // async verifyToken(
  //   @Body() registerNotificationDto: RegisterNotificationDto,
  // ): Promise<DecodedIdToken> {
  //   return this.notificationService.verifyFirebaseToken(
  //     registerNotificationDto,
  //   );
  // }
}
