import { Exclude } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ClientStatus } from 'src/shares/enums/client.enum';

export const CLIENT_MODEL = 'clients';

@Schema({ _id: false })
export class ClientProduct {
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
  })
  product_id: string;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  end_time: MongooseSchema.Types.Date;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  start_time: MongooseSchema.Types.Date;
}

export const ClientProductSchema = SchemaFactory.createForClass(ClientProduct);

@Schema({ timestamps: true, collection: CLIENT_MODEL })
export class Client {
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
  japanese_name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Number })
  gender: number;

  @Prop({ required: false, type: String })
  token_app: string;

  @Prop({ type: Boolean, default: false })
  is_banned: boolean;

  @Prop({ type: String, enum: ClientStatus, default: ClientStatus.INACTIVE })
  status: ClientStatus;

  @Prop({ type: String })
  facebook_id: string;

  @Prop({ type: String })
  google_id: string;

  @Prop({ type: Date })
  last_login_at: Date;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
