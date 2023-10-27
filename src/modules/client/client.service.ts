import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Client, ClientDocument } from './schemas/client.schema';
import { UserGoogleInfoDto } from '../auth/dto/user-google-info.dto';
import { ClientRole, ClientStatus } from 'src/shares/enums/client.enum';
import { UserFacebookInfoDto } from '../auth/dto/user-facebook-info.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  async findById(_id: string): Promise<Client> {
    return this.clientModel.findById(_id).select('-password');
  }

  async findOrCreateFacebookUser(
    profile: UserFacebookInfoDto,
  ): Promise<Client> {
    const client = await this.clientModel.findOne({ facebook_id: profile.id });
    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: profile.picture.data.url,
          lastLoginAt: new Date(),
        },
        { new: true },
      );
    }
    return this.clientModel.create({
      facebook_id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      image_url: profile.picture.data.url,
      role: ClientRole.user,
      last_login_at: new Date(),
      status: ClientStatus.ACTIVE,
      is_verify: true,
    });
  }

  async findOrCreateGoogleUser(profile: UserGoogleInfoDto): Promise<Client> {
    const { sub, picture, given_name, family_name, email } = profile.data;
    const client = await this.clientModel.findOne({ google_id: sub });
    if (client) {
      return this.clientModel.findByIdAndUpdate(
        client._id,
        {
          image_url: picture,
          last_login_at: new Date(),
          email,
        },
        { new: true },
      );
    }
    return this.clientModel.create({
      google_id: sub,
      name: `${given_name} ${family_name}`,
      image_url: picture,
      role: ClientRole.user,
      last_login_at: new Date(),
      email,
      status: ClientStatus.ACTIVE,
      is_verify: true,
    });
  }
}
