import { Module } from '@nestjs/common';

import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from './note.controller';
import { Note, NoteSchema } from './schemas/note.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
