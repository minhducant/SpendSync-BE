import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import {
  ClientPolicy,
  ClientPolicySchema,
} from './schemas/client-policy.schema';
import { ClientService } from './client.service';
import { MongooseModule } from '@nestjs/mongoose';
import { redisConfig } from 'src/configs/redis.config';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: ClientPolicy.name, schema: ClientPolicySchema },
    ]),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
  ],
  exports: [ClientService],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
