import mongoose, { Model } from 'mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import {
  ChangeStatus,
  UpdateNoteDto,
  ChangeMemberDto,
} from './dto/update-note.dto';
import { GetNoteDto } from './dto/get-note.dto';
import { httpErrors } from 'src/shares/exceptions';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async find(
    getNoteDto: GetNoteDto,
    user_id: string,
  ): Promise<ResPagingDto<Note[]>> {
    const { sort, page, limit, title, status } = getNoteDto;
    const query: any = {};
    query.$or = [{ user_id: user_id }, { 'members._id': user_id }];
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (status !== undefined) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else {
        query.status = status;
      }
    } else {
      query.status = { $nin: [6, 7] };
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

  async createNote(payload: CreateNoteDto, create_by: string): Promise<void> {
    await this.noteModel.create({
      ...payload,
      user_id: create_by,
    });
  }

  async updateNote(updateNoteDto: UpdateNoteDto): Promise<any> {
    await this.noteModel.findOneAndUpdate(
      { _id: updateNoteDto._id },
      updateNoteDto,
      {
        new: true,
      },
    );
  }

  async changeMember(dto: ChangeMemberDto): Promise<void> {
    const { _id, members } = dto;
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

  async changeStatusById(dto: ChangeStatus): Promise<void> {
    const { _id, status } = dto;
    const order = await this.noteModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.NOTE_NOT_FOUND);
    }
    await this.noteModel.findOneAndUpdate(
      { _id },
      { status: status },
      { new: true },
    );
  }
}
