import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { GetUsersDto } from './dto/get-users.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('User - Người dùng')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[User] Get all user' })
  async findAll(
    @Query() query: GetUsersDto,
  ): Promise<ResPagingDto<User[]>> {
    return this.userService.findAll(query);
  }

}
