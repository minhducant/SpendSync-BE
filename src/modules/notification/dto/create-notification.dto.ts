import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly notification_token: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly device_type: string;
}
