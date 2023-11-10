import mongoose, { Model, Types } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { List } from './schemas/friend.schema';
import { httpErrors } from 'src/shares/exceptions';
import { AddFriendDto } from './dto/add-friend.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Friend, FriendDocument } from './schemas/friend.schema';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findByUserId(user_id: string): Promise<List[] | []> {
    const data = await this.friendModel.findOne({ user_id: user_id });
    if (!data || !data.friends) {
      return [];
    }
    return data.friends;
  }

  async addFriend(payload: AddFriendDto, create_by: string): Promise<void> {
    const data = await this.friendModel.findOne({ user_id: create_by });
    if (data) {
      const isFriendExist = data.friends.some((friend) =>
        new Types.ObjectId(friend._id).equals(new Types.ObjectId(payload._id)),
      );
      if (isFriendExist) {
        throw new BadRequestException('Bạn bè đã tồn tại.');
      }
      data.friends.push(payload);
      await data.save();
    } else {
      await this.friendModel.create({
        friends: [payload],
        user_id: create_by,
      });
    }
  }

  async deleteFriend(userId: string, friendId: string): Promise<void> {
    const data = await this.friendModel.findOne({ user_id: userId });
    if (!data || !data.friends) {
      throw new NotFoundException('Không tìm thấy người bạn.');
    }
    const friendIndex = data.friends.findIndex((friend) =>
      new Types.ObjectId(friend._id).equals(new Types.ObjectId(friendId)),
    );
    if (friendIndex === -1) {
      throw new NotFoundException('Người bạn không tồn tại trong danh sách.');
    }
    data.friends.splice(friendIndex, 1);
    await data.save();
  }
}
