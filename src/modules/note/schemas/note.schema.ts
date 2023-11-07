// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const NOTE_MODEL = 'note';

@Schema({ _id: false })
export class Member {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true })
  memberId: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);


@Schema({ timestamps: true, collection: NOTE_MODEL })
export class Note {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: String })
  desc?: string;

  @Prop({ required: false, type: String })
  color?: string;

  @Prop({ required: false, type: [{ type: MemberSchema }] })
  member?: Member[];;
}

export type NoteDocument = Note & Document;

export const NoteSchema = SchemaFactory.createForClass(Note);
