import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateGatewayMomoDto } from './dto/momo.dto';
import { GetPaymentDto } from './dto/get-payments.dto';
import { paymentMethodsByCountry } from './config/payment-methods';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getPaymentMethods(GetPaymentDto: GetPaymentDto) {
    const normalizedCountryCode = GetPaymentDto.country.toUpperCase();
    return paymentMethodsByCountry[normalizedCountryCode] || [];
  }

  async createGatewayMomo(CreateGatewayMomoDto, user_id) {}

  async refundMomo() {}

  async confirmTransactionMomo() {}

  async queryTransactionMomo() {}

  async useVNPay() {}

  async usePayPal() {}

  async generateSignature(data: any) {
    const formattedData = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');

    const secretKey = 'YourSecretKeyHere';
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(formattedData);
    const signature = hmac.digest('hex');
    return signature;
  }
}
