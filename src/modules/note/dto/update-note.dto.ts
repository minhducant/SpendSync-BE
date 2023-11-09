import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsArray,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

import { MemberDto } from './create-note.dto';
import { StatusEnum } from 'src/shares/enums/note.enum';

export class ChangeMemberDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @ApiProperty({ required: false, type: MemberDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly members: MemberDto[];
}

export class ChangeStatus {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @ApiProperty({ required: true, enum: StatusEnum })
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
