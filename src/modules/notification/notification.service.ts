import mongoose, { Model } from 'mongoose';
import * as firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getAppCheck } from 'firebase-admin/app-check';

import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetNotificationDto } from './dto/get-notifications.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RegisterNotificationDto } from './dto/register-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import {
  NotificationToken,
  NotificationTokenDocument,
} from './schemas/notification_token.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationToken.name)
    private notificationTokenModel: Model<NotificationTokenDocument>,
  ) {}

  async registerNotification(
    user_id: string,
    payload: RegisterNotificationDto,
  ) {}

  async updateNotification(user_id: string, payload: RegisterNotificationDto) {}

  async sendNotification() {}

  async getNotifications(
    GetNotificationsDto: GetNotificationDto,
    user_id: string,
  ): Promise<ResPagingDto<Notification[]>> {
    const { sort, page, limit } = GetNotificationsDto;

    const query: any = { user_id: new mongoose.Types.ObjectId(user_id) };

    const pipeline = [
      { $match: query },
      { $sort: { createdAt: sort } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [result, total] = await Promise.all([
      this.notificationModel.aggregate(pipeline).exec(),
      this.notificationModel.countDocuments(query),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }
}
