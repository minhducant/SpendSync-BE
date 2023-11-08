import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  IsMongoId,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

class MemberDto {
  @ApiProperty({ required: true, description: 'The member ID' })
  @IsMongoId()
  readonly _id: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly image_url: string;
}

export class CreateNoteDto {
  @ApiProperty({ required: true, description: 'The title of the note' })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false, description: 'The description of the note' })
  @IsString()
  readonly desc: string;

  @ApiProperty({
    required: false,
    description: 'The color of the note',
    example: '#FFFFFF',
  })
  @IsString()
  readonly color: string;

  @ApiProperty({ required: true, type: Number, example: 1 })
  @IsNumber()
  status: Number;

  @ApiProperty({ required: true, type: MemberDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly members: MemberDto[];
}
