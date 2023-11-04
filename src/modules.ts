import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { mongodb } from 'src/configs/database.config';
import { redisConfig } from 'src/configs/redis.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ClientModule } from 'src/modules/client/client.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';

const Modules: any = [
  ConsoleModule,
  ConfigModule.forRoot({ isGlobal: true }),
  ScheduleModule.forRoot(),
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  AuthModule,
  ClientModule,
  FirebaseModule,
];
export default Modules;
