import {
  IsIn,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  ArrayMaxSize,
} from 'class-validator';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ProductDetailDto {
  @ApiProperty({ description: 'SKU number' })
  @Prop()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Tên sản phẩm' })
  @Prop()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Miêu tả sản phẩm' })
  @Prop()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Phân loại ngành hàng của sản phẩm' })
  @Prop()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Link hình ảnh của sản phẩm' })
  @Prop()
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'Tên nhà sản xuất' })
  @Prop()
  @IsString()
  manufacturer: string;

  @ApiProperty({ description: 'Đơn giá' })
  @Prop()
  @IsNumber()
  price: number;

  @ApiProperty({ default: 'VND', description: 'VND' })
  @Prop({ default: 'VND' })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Số lượng của sản phẩm. Cần là một số lớn hơn 0',
  })
  @Prop()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Đơn vị đo lường của sản phẩm này' })
  @Prop()
  @IsString()
  unit: string;

  @ApiProperty({ description: 'Tổng giá = Đơn giá x Số lượng' })
  @Prop()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: 'Tổng thuế' })
  @Prop()
  @IsNumber()
  taxAmount: number;
}

@Schema()
export class DeliveryInfoDto {
  @ApiProperty({ description: 'Địa chỉ giao hàng' })
  @Prop()
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ description: 'Phí giao hàng' })
  @Prop()
  @IsString()
  deliveryFee: string;

  @ApiProperty({ description: 'Số lượng sản phẩm' })
  @Prop()
  @IsString()
  quantity: string;
}

@Schema()
export class UserInfoDto {
  @ApiProperty({ description: 'Tên của người dùng' })
  @Prop()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số điện thoại của người dùng' })
  @Prop()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Email của người dùng' })
  @Prop()
  @IsString()
  email: string;
}

@Schema()
export class CreateGatewayMomoDto extends Document {
  @ApiProperty({
    required: true,
    description: 'Mã đối tác, thông tin tích hợp',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  partnerCode: string;

  @ApiProperty({ description: 'Định danh duy nhất của tài khoản M4B của bạn' })
  @Prop()
  @IsOptional()
  subPartnerCode: string;

  @ApiProperty({ required: true, description: 'Tên của đối tác' })
  @Prop({ required: true })
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ required: true, description: 'Mã cửa hàng của đối tác' })
  @Prop({ required: true })
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({
    required: true,
    description:
      'Định danh duy nhất cho mỗi yêu cầu, được đối tác sử dụng để xử lý idempotency',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    required: true,
    description:
      'Số tiền cần thanh toán, có giới hạn từ 1.000 VND đến 50.000.000 VND',
  })
  @Prop({ required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true, description: 'Mã đơn hàng của đối tác' })
  @Prop({ required: true })
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    required: true,
    description: 'Loại yêu cầu, ở đây là "captureWallet"',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  requestType: string;

  @ApiProperty({
    required: true,
    description:
      'Chữ ký để xác nhận giao dịch, sử dụng thuật toán HMAC_SHA256 với dữ liệu theo định dạng được sắp xếp từ a-z',
  })
  @Prop({ required: true })
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ description: 'Thông tin chi tiết về đơn hàng' })
  @Prop()
  @IsOptional()
  orderInfo: string;

  @ApiProperty({
    description:
      'Mã nhóm đơn hàng, được cung cấp bởi MoMo để phân nhóm đơn hàng cho các hoạt động vận hành sau này',
  })
  @Prop()
  @IsOptional()
  orderGroupId: number;

  @ApiProperty({
    description:
      'URL của đối tác, được sử dụng để chuyển hướng từ MoMo về trang mua hàng của đối tác sau khi thanh toán',
  })
  @Prop()
  @IsOptional()
  redirectUrl: string;

  @ApiProperty({
    description:
      'API của đối tác, được MoMo sử dụng để gửi kết quả thanh toán theo phương thức IPN (server-to-server)',
  })
  @Prop()
  @IsOptional()
  ipnUrl: string;

  @ApiProperty({
    description: 'Dữ liệu bổ sung, được mã hóa base64 theo định dạng JSON',
  })
  @Prop()
  @IsOptional()
  extraData: string;

  @ApiProperty({
    type: [ProductDetailDto],
    default: ProductDetailDto,
    description:
      'Danh sách các sản phẩm hiển thị trên trang thanh toán, tối đa 50 loại sản phẩm',
  })
  @Prop({ default: ProductDetailDto })
  @ArrayMaxSize(50, {
    message: 'items array cannot have more than 50 elements',
  })
  @IsOptional()
  items: ProductDetailDto[];

  @ApiProperty({
    type: DeliveryInfoDto,
    description: 'Thông tin giao hàng của đơn hàng',
  })
  @Prop()
  @IsOptional()
  deliveryInfo: DeliveryInfoDto;

  @ApiProperty({ type: UserInfoDto, description: 'Thông tin về người dùng' })
  @Prop()
  @IsOptional()
  userInfo: UserInfoDto;

  @ApiProperty({
    description:
      'Mã tham chiếu phụ của đối tác, có thể là mã khách hàng, mã hộ gia đình, mã hóa đơn, mã thuê bao, v.v',
  })
  @Prop()
  @IsOptional()
  referenceId: string;

  @ApiProperty({
    default: true,
    description:
      'Xác định liệu giao dịch sẽ tự động capture hay không, mặc định là true',
  })
  @Prop({ default: true })
  @IsBoolean()
  autoCapture: boolean;

  @ApiProperty({
    description: 'Ngôn ngữ của message được trả về, có thể là "vi" hoặc "en"',
  })
  @Prop()
  @IsOptional()
  @IsIn(['vi', 'en'])
  lang: string;
}

export class RefundMomoDto {
  @ApiProperty({ description: 'Mã đối tác, thông tin tích hợp' })
  @IsNotEmpty()
  @IsString()
  partnerCode: string;

  @ApiProperty({ description: 'Mã đơn hàng của đối tác' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description:
      'Định danh duy nhất cho mỗi yêu cầu, được đối tác sử dụng để xử lý idempotency',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({ description: 'Số tiền cần hoàn lại' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Mã giao dịch MoMo' })
  @IsNotEmpty()
  @IsString()
  transId: string;

  @ApiProperty({
    description: 'Ngôn ngữ của message được trả về, có thể là "vi" hoặc "en"',
  })
  @IsString()
  @IsIn(['vi', 'en'])
  lang: string;

  @ApiProperty({ description: 'Miêu tả yêu cầu hoàn tiền' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Chữ ký để xác nhận giao dịch' })
  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class ConfirmMomoDto {
  @ApiProperty({ description: 'Mã đối tác, thông tin tích hợp' })
  @IsNotEmpty()
  @IsString()
  partnerCode: string;

  @ApiProperty({ description: 'Mã đơn hàng của đối tác' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description:
      'Định danh duy nhất cho mỗi yêu cầu, được đối tác sử dụng để xử lý idempotency',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({ description: 'Loại yêu cầu, ở đây là "confirm"' })
  @IsNotEmpty()
  @IsString()
  requestType: string;

  @ApiProperty({ description: 'Số tiền cần xác nhận thanh toán' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Ngôn ngữ của message được trả về, có thể là "vi" hoặc "en"',
  })
  @IsString()
  @IsIn(['vi', 'en'])
  lang: string;

  @ApiProperty({ description: 'Miêu tả yêu cầu xác nhận thanh toán' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Chữ ký để xác nhận giao dịch' })
  @IsNotEmpty()
  @IsString()
  signature: string;
}

export class QueryMomoDto {
  @ApiProperty({ description: 'Mã đối tác, thông tin tích hợp' })
  @IsNotEmpty()
  @IsString()
  partnerCode: string;

  @ApiProperty({ description: 'Mã đơn hàng của đối tác' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({
    description:
      'Định danh duy nhất cho mỗi yêu cầu, được đối tác sử dụng để xử lý idempotency',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({
    description: 'Ngôn ngữ của message được trả về, có thể là "vi" hoặc "en"',
  })
  @IsString()
  @IsIn(['vi', 'en'])
  lang: string;

  @ApiProperty({ description: 'Chữ ký để xác nhận giao dịch' })
  @IsNotEmpty()
  @IsString()
  signature: string;
}
