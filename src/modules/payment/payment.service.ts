import * as https from 'https';
import axios from 'axios';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PaymentMomoDto } from './dto/momo.dto';
import { GetPaymentDto } from './dto/get-payments.dto';
import { signatureDataMomo } from './config/momo.config';
import { User, UserDocument } from '../user/schemas/user.schema';
import { paymentMethodsByCountry } from './config/payment-methods.config';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getPaymentMethods(GetPaymentDto: GetPaymentDto) {
    const normalizedCountryCode = GetPaymentDto.country.toUpperCase();
    return paymentMethodsByCountry[normalizedCountryCode] || [];
  }

  async createGatewayMomo() {
    const signature = await this.generateSignature(signatureDataMomo);
    const requestBody = JSON.stringify({
      ...signatureDataMomo,
      signature,
      lang: 'en',
    });
    try {
      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(`Problem with request: ${error.message}`);
      throw error;
    }
  }

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
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(formattedData);
    const signature = hmac.digest('hex');
    return signature;
  }
}
