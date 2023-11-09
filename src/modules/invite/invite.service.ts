import { Injectable } from '@nestjs/common';

@Injectable()
export class InviteService {
  constructor() {}
  async generateCustomerCode(prefix) {
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const customerCode = prefix + randomNumber;
    return customerCode;
  }
}
