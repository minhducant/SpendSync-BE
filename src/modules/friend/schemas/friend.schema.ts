import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const FRIEND_MODEL = 'friend';

@Schema({ _id: false })
export class List {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true })
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  image_url: string;
}

export const listSchema = SchemaFactory.createForClass(List);


@Schema({ timestamps: true, collection: FRIEND_MODEL })
export class Friend {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: [{ type: listSchema }] })
  friends: List[];
}

export type FriendDocument = Friend & Document;

export const FriendSchema = SchemaFactory.createForClass(Friend);
