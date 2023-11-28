import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../user/schemas/user.schema';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {
  constructor() {
    const { serviceAccount } = require('../../configs/firebase.config');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
