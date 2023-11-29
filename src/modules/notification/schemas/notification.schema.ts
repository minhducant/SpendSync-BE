import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTIFICATION_MODEL = 'notification';
@Schema({ timestamps: true, collection: NOTIFICATION_MODEL })
export class Notification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: USER_MODEL })
  user_id: string;

  @Prop({ type: String, default: null, required: true })
  token_id: string;

  @Prop({ type: [Object], default: [], required: true })
  notifications: [Object];

  @Prop({ type: Object, default: {}, required: true })
  data: Object;

  @Prop({ type: Date})
  createdAt: Date;

  @Prop({ type: Boolean })
  is_read: Boolean;
}

export type NoteDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
