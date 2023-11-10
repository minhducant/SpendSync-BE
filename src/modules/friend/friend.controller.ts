import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';

import { List } from './schemas/friend.schema';
import { FriendService } from './friend.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { GetNoteDto } from 'src/modules/friend/dto/get-friend.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Friend - Bạn bè')
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get()
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Get friends',
  })
  async findByUserId(@UserID() userId: string): Promise<List[] | []> {
    return this.friendService.findByUserId(userId);
  }

  @Post('/add')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Add new friend',
  })
  async createNote(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.addFriend(body, userId);
  }

  @Post('/delete')
  @ApiBearerAuth()
  @UserAuth()
  @ApiOperation({
    summary: '[Friend] Delete friend',
  })
  async deleteFriend(
    @Body() body: AddFriendDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.friendService.addFriend(body, userId);
  }
}
