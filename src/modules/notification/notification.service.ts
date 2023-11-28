import { Model } from 'mongoose';
import * as firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Notification } from './schemas/notification.schema';
import { NotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationToken } from './schemas/notification-token.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationsRepo: Model<Notification>,
    // @InjectModel(NotificationToken.name)
    // private notificationTokenRepo: Model<NotificationToken>,
  ) {}

//   acceptPushNotification = async (
//     user: any,
//     notification_dto: NotificationDto,
//   ): Promise<NotificationToken> => {
//     await this.notificationTokenRepo.updateOne(
//       { user: { id: user.id } },
//       {
//         $set: { status: 'INACTIVE' },
//       },
//     );
//     const notificationTokenInstance = new this.notificationTokenRepo({
//       user: user,
//       device_type: notification_dto.device_type,
//       notification_token: notification_dto.notification_token,
//       status: 'ACTIVE',
//     });
//     const notification_token = await notificationTokenInstance.save();
//     return notification_token;
//   };

//   getNotifications = async (): Promise<any> => {
//     return await this.notificationsRepo.find();
//   };

//   disablePushNotification = async (
//     user: any,
//     update_dto: UpdateNotificationDto,
//   ): Promise<void> => {
//     try {
//       await this.notificationTokenRepo.findOneAndUpdate(
//         { user: { id: user.id }, device_type: update_dto.device_type },
//         { $set: { status: 'INACTIVE' } },
//       );
//     } catch (error) {
//       return error;
//     }
//   };

//   sendPush = async (user: any, title: string, body: string): Promise<void> => {
//     try {
//       const notification = await this.notificationTokenRepo.findOne({
//         user: { id: user.id },
//         status: 'ACTIVE',
//       });
//       if (notification) {
//         const newNotification = await this.notificationsRepo.create({
//           notification_token: notification,
//           title,
//           body,
//           status: 'ACTIVE',
//           created_by: user.username,
//         });
//         await newNotification.save();
//         await firebase
//           .messaging()
//           .send({
//             notification: { title, body },
//             token: notification.notification_token,
//             android: { priority: 'high' },
//           })
//           .catch((error: any) => {
//             console.error(error);
//           });
//       }
//     } catch (error) {
//       return error;
//     }
//   };
}
