import {
  HttpStatus,
  HttpException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { httpErrors } from '../exceptions';

export const UserID = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    try {
      return ctx.switchToHttp().getRequest()?.user?._id.toString();
    } catch (e) {
      throw new HttpException(httpErrors.UNAUTHORIZED, HttpStatus.BAD_REQUEST);
    }
  },
);
