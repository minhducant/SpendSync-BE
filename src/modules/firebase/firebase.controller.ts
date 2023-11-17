import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FirebaseService } from './firebase.service';
import { ISendFirebaseMessages } from './dto/push-notification.dto';

@ApiTags('Firebase - Thông báo')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send-message')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Firebase] Push notification',
  })
  async sendFirebaseMessages(
    @Body() firebaseMessages: ISendFirebaseMessages,
  ) {
    try {
      const result = await this.firebaseService.sendFirebaseMessage(
        firebaseMessages,
      );
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
