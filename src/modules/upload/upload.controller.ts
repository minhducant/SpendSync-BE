import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UploadService } from './upload.service';
import { ResUploadDto } from './dto/res-upload.dto';

@Controller('upload')
@ApiTags('Upload - Xử lý file')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('/file')
  @ApiOperation({ summary: '[Upload] Upload file' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ResUploadDto> {
    return this.uploadService.uploadLinode(file);
  }

  @Post('/image')
  @ApiOperation({ summary: '[Upload] Upload image' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResUploadDto> {
    return this.uploadService.uploadLinode(file);
  }
}
