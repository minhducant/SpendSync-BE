import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';

import { mongodb } from 'src/configs/database.config';
import { redisConfig } from 'src/configs/redis.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ClientModule } from 'src/modules/client/client.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';

const Modules: any = [
  ConsoleModule,
  ScheduleModule.forRoot(),
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 10,
  }]),
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  //Customer Module
  AuthModule,
  ClientModule,
  FirebaseModule,
];
export default Modules;
