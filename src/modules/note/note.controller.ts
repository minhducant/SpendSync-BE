import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';

import { Note } from './schemas/note.schema';
import { NoteService } from './note.service';
import { GetNoteDto } from './dto/get-note.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Note - Ghi chú')
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @ApiBearerAuth()
  @UserAuth()
  @Get()
  @ApiOperation({ summary: '[Note] Get notes', description: 'Display notes' })
  async find(
    @UserID() userId: string,
    @Query() query: GetNoteDto,
  ): Promise<ResPagingDto<Note[]>> {
    return this.noteService.find(query, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Note] Get note by id',
  })
  async findOne(@Param() { id }: IdDto): Promise<Note> {
    return this.noteService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Note] Create note',
  })
  async create(
    @Body() body: CreateNoteDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.noteService.create(body, userId);
  }
}
