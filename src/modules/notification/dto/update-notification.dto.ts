import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly device_type: string;
}
