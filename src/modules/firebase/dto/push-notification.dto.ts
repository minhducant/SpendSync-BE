import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class ISendFirebaseMessages {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class NotificationDto {
  @ApiProperty({ required: false, type: ISendFirebaseMessages, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly members: ISendFirebaseMessages[];
}
