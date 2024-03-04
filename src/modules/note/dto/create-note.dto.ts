import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsString,
  IsArray,
  IsNumber,
  IsObject,
  IsMongoId,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

export class MemberDto {
  @ApiProperty({ required: true, description: 'The member ID' })
  // @IsMongoId()
  readonly _id: string;
  
  @ApiProperty({ required: false, description: 'The member ID' })
  @IsOptional()
  @IsMongoId()
  readonly user_id: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly image_url: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  readonly permission: number;
}

export class NoteLineDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MemberDto)
  readonly buyer: MemberDto;

  @ApiProperty({ required: true })
  @IsString()
  readonly expense: string;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  readonly cost: number;

  @ApiProperty({ required: false, example: '#FFFFFF' })
  @IsOptional()
  @IsString()
  readonly color: string;

  @ApiProperty({ required: false, type: Number, example: 0 })
  @IsOptional()
  @IsNumber()
  topic?: Number

  @ApiProperty({ required: false, type: MemberDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly sharers: MemberDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly payment_date: Date;
}

export class CreateNoteDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly desc: string;

  @ApiProperty({ required: false, example: '#FFFFFF' })
  @IsOptional()
  @IsString()
  readonly color: string;

  @ApiProperty({ required: false, type: Number, example: 1 })
  @IsNumber()
  status: Number;

  @ApiProperty({ required: false, type: Number, example: 0 })
  @IsOptional()
  @IsNumber()
  currency: Number

  @ApiProperty({ required: false, type: MemberDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: false })
  @Type(() => Object)
  readonly members: MemberDto[];

  @ApiProperty({ required: false, type: NoteLineDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  readonly note_line: NoteLineDto[];
}
