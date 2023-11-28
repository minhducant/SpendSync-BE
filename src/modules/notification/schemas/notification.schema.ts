import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { NotificationToken } from './notification-token.schema';

@Schema({ collection: 'notifications' })
export class Notification extends Document {
  @Prop()
  title: string;

  @Prop({ type: String, default: null })
  body: string | null;

  @Prop()
  created_by: string;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ type: NotificationToken, ref: 'NotificationToken' })
  notification_token: NotificationToken;

  @Prop({ type: Boolean, default: false })
  is_read: Boolean;
}

export type NoteDocument = Notification & Document;

export const NotificationSchema = SchemaFactory.createForClass(Notification);
