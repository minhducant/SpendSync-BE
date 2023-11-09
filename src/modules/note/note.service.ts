import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';

import { GetNoteDto } from './dto/get-note.dto';
import { httpErrors } from 'src/shares/exceptions';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { ChangeMemberDto, ChangeStatus } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async find(
    getNoteDto: GetNoteDto,
    user_id: string,
  ): Promise<ResPagingDto<Note[]>> {
    const { sort, page, limit, title } = getNoteDto;
    const query: any = {};
    query.$or = [{ user_id: user_id }, { 'members._id': user_id }];
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    const [result, total] = await Promise.all([
      this.noteModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.noteModel.find(query).countDocuments(),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Note> {
    return this.noteModel.findOne({ _id: id });
  }

  async create(payload: CreateNoteDto, create_by: string): Promise<void> {
    await this.noteModel.create({
      ...payload,
      user_id: create_by,
    });
  }

  async changeMember(body: ChangeMemberDto): Promise<void> {
    const { _id, members } = body;
    const order = await this.noteModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.NOTE_NOT_FOUND);
    }
    await this.noteModel.findOneAndUpdate(
      { _id },
      { members: members },
      { new: true },
    );
  }

  async changeStatusById(_id: string, dto: ChangeStatus): Promise<void> {
    const order = await this.noteModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.NOTE_NOT_FOUND);
    }
    await this.noteModel.findOneAndUpdate(
      { _id },
      { status: dto.status },
      { new: true },
    );
  }
}
