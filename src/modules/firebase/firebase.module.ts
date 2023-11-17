import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';

@Module({
  providers: [FirebaseService],
  controllers: [FirebaseController],
})
export class FirebaseModule {
  constructor() {
    const { serviceAccount } = require('../../configs/firebase.config');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}
