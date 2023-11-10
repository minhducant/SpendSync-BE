import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Friend, FriendSchema } from './schemas/friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
  ],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
