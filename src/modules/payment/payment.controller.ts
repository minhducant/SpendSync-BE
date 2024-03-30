import { DecodedIdToken } from 'firebase-admin/auth';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  QueryMomoDto,
  PaymentMomoDto,
  RefundMomoDto,
  ConfirmMomoDto,
  CreateGatewayMomoDto,
} from './dto/momo.dto';
import { PaymentService } from './payment.service';
import { GetPaymentDto } from './dto/get-payments.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Payment - Thanh toán, chuyển tiền')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/list')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Get list payments' })
  async getNotifications(
    @UserID() user_id: string,
    @Query() query: GetPaymentDto,
  ): Promise<ResPagingDto<Notification[]>> {
    return this.paymentService.getPaymentMethods(query);
  }

  @Post('/momo/create')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Momo create gateway' })
  async createGatewayMomo(
    @UserID() user_id: string,
    // @Body() PaymentMomoDto: PaymentMomoDto,
  ): Promise<any> {
    return this.paymentService.createGatewayMomo();
  }

  @Post('/momo/query')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Momo query transaction payment' })
  async queryTransactionMomo(
    @UserID() user_id: string,
    @Body() QueryMomoDto: QueryMomoDto,
  ): Promise<void> {
    return this.paymentService.queryTransactionMomo();
  }

  @Post('/momo/refund')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Momo refund transaction payment' })
  async refundMomo(
    @UserID() user_id: string,
    @Body() RefundMomoDto: RefundMomoDto,
  ): Promise<void> {
    return this.paymentService.refundMomo();
  }

  @Post('/momo/confirm')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Momo confirm transaction payment' })
  async confirmTransactionMomo(
    @UserID() user_id: string,
    @Body() ConfirmMomoDto: ConfirmMomoDto,
  ): Promise<void> {
    return this.paymentService.confirmTransactionMomo();
  }

  @Post('/vnpay/create')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] VNPay payment' })
  async useVNPay(@Body() {}: any): Promise<void> {
    return this.paymentService.useVNPay();
  }

  @Post('/paypal/create')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Payment] Paypal payment' })
  async usePayPal(@Body() {}: any): Promise<void> {
    return this.paymentService.usePayPal();
  }
}
