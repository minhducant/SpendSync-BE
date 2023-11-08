import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';

import { InviteService } from './invite.service';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Invite - Chia sẻ')
@Controller('invite')
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Post()
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Note] Create note',
  })
  async create(
    @UserID() userId: string,
  ): Promise<void> {
    await userId;
  }
}
