import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { GetUserDto } from './dto/get-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { User, UserDocument } from './schemas/user.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserRole, UserStatus } from 'src/shares/enums/user.enum';
import { UserGoogleInfoDto } from '../auth/dto/user-google-info.dto';
import { UserFacebookInfoDto } from '../auth/dto/user-facebook-info.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findById(_id: string): Promise<User> {
    return this.userModel.findById(_id).select('-password');
  }

  async findOne(condition: GetUserDto, selectPassword = false): Promise<User> {
    if (selectPassword) {
      return this.userModel.findOne(condition).select('+password');
    }
    return this.userModel.findOne(condition);
  }

  async findAll(getUsersDto: GetUsersDto): Promise<ResPagingDto<User[]>> {
    const { sort, page, limit, id, name, phone } = getUsersDto;
    const query: any = {};
    if (id) {
      query._id = id;
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    if (phone) {
      query.phone = { $regex: phone, $options: 'i' };
    }
    const [result, total] = await Promise.all([
      this.userModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.userModel.find(query).countDocuments(),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOrCreateFacebookUser(profile: UserFacebookInfoDto): Promise<User> {
    const user = await this.userModel.findOne({ facebook_id: profile.id });
    if (user) {
      return this.userModel.findByIdAndUpdate(
        user._id,
        {
          image_url: profile.picture.data.url,
          lastLoginAt: new Date(),
        },
        { new: true },
      );
    }
    return this.userModel.create({
      facebook_id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      image_url: profile.picture.data.url,
      role: UserRole.user,
      last_login_at: new Date(),
      status: UserStatus.ACTIVE,
      is_verify: true,
    });
  }

  async findOrCreateGoogleUser(profile: UserGoogleInfoDto): Promise<User> {
    const { sub, picture, given_name, family_name, email } = profile.data;
    const user = await this.userModel.findOne({ google_id: sub });
    if (user) {
      return this.userModel.findByIdAndUpdate(
        user._id,
        {
          image_url: picture,
          last_login_at: new Date(),
          email,
        },
        { new: true },
      );
    }
    return this.userModel.create({
      google_id: sub,
      name: `${given_name} ${family_name}`,
      image_url: picture,
      role: UserRole.user,
      last_login_at: new Date(),
      email,
      status: UserStatus.ACTIVE,
      is_verify: true,
    });
  }
}