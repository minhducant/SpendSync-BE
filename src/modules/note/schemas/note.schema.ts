import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { StatusEnum } from 'src/shares/enums/note.enum';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTE_MODEL = 'note';

@Schema({ _id: false })
export class Member {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true })
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  image_url: string;
}

export const memberSchema = SchemaFactory.createForClass(Member);

@Schema({ timestamps: true, collection: NOTE_MODEL })
export class Note {
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({
    required: true,
    type: Number,
    enum: StatusEnum,
    default: StatusEnum.incomplete,
  })
  status?: StatusEnum;

  @Prop({ required: false, type: String })
  color: string;

  @Prop({ required: false, type: [{ type: memberSchema }] })
  members: Member[]; 
}

export type NoteDocument = Note & Document;

export const NoteSchema = SchemaFactory.createForClass(Note);
