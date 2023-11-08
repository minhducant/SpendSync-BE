import { Exclude } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserStatus } from 'src/shares/enums/user.enum';

export const USER_MODEL = 'user';

@Schema({ timestamps: true, collection: USER_MODEL })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, sparse: true })
  code: string;

  @Prop({ type: String, select: false })
  @Exclude()
  password: string;

  @Prop({ type: [String] })
  address: string[];

  @Prop({ type: String })
  full_name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Number })
  gender: number;

  @Prop({ required: false, type: String })
  token_app: string;

  @Prop({ type: Boolean, default: false })
  is_banned: boolean;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @Prop({ type: String })
  facebook_id: string;

  @Prop({ type: String })
  google_id: string;

  @Prop({ type: Date })
  last_login_at: Date;

  @Prop({ required: false, type: String })
  image_url: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);