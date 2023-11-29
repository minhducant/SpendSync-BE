import { Model } from 'mongoose';
import * as firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Notification } from './schemas/notification.schema';
import { RegisterNotificationDto } from './dto/register-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationsRepo: Model<Notification>,
  ) {}

  async registerNotification(
    user_id: string,
    payload: RegisterNotificationDto,
  ) {
    const obj = await this.notificationsRepo.findOne({ user_id: user_id });
    if (obj) return;
    await this.notificationsRepo.create({
      ...payload,
      user_id: user_id,
    });
  }

  async updateNotification(user_id: string, payload: RegisterNotificationDto) {}

  async sendNotification() {}

  async getNotifications(user_id: string) {}
}
