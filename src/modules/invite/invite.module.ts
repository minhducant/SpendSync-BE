import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { InviteService } from './invite.service';
import { NoteModule } from '../note/note.module';
import { InviteController } from './invite.controller';
import { redisConfig } from 'src/configs/redis.config';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    NoteModule,
    JwtModule.register({}),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [InviteService],
  controllers: [InviteController],
})
export class InviteModule {}
