import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';

class MemberDto {
  @ApiProperty({ required: false, description: 'The member ID' })
  @IsString()
  readonly memberId: string;
}

export class CreateNoteDto {
  @ApiProperty({ required: false, description: 'The user ID' })
  @IsString()
  readonly user_id: string;

  @ApiProperty({ required: true, description: 'The title of the note' })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true, description: 'The description of the note' })
  @IsString()
  readonly desc: string;

  @ApiProperty({ required: false, description: 'The color of the note', example: '#FFFFFF' })
  @IsString()
  readonly color: string;

  @ApiProperty({ required: false, description: 'The list of members' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  readonly members: MemberDto[];
}
