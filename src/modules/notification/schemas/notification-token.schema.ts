import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';

@Schema({ collection: 'notification_tokens' })
export class NotificationToken extends Document {
  @Prop({ type: User })
  user: User;

  @Prop()
  device_type: string;

  @Prop()
  notification_token: string;

  @Prop({ default: 'ACTIVE' })
  status: string;
}

export type NotificationTokenDocument = NotificationToken & Document;

export const NotificationTokenSchema = SchemaFactory.createForClass(
  NotificationToken,
);
