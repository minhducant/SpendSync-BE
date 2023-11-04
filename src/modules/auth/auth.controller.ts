import { User } from '@sentry/node';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { LoginGoogleDto } from './dto/login-google.dto';
import { ClientService } from '../client/client.service';
import { ClientRtGuards } from './guards/client-rt.guard';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { ClientAuth } from 'src/shares/decorators/http.decorators';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { GetCurrentUser } from 'src/shares/decorators/get-current-user.decorators';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
  ) {}

  @Get('client/current')
  @ClientAuth()
  @ApiOperation({ summary: '[ Client ] Get get access token info' })
  async currentClient(@UserID() clientId: string): Promise<User> {
    console.log("client/current")
    return this.clientService.findById(clientId);
  }

  @Post('client/refresh-access-token')
  @ApiOperation({ summary: '[ Client ] Get new Access Token' })
  @UseGuards(ClientRtGuards)
  async clientRefreshAccessToken(
    @GetCurrentUser() client: PayloadRefreshTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    return this.authService.ClientGetAccessToken(client);
  }

  @Post('client/facebook/login')
  @ApiOperation({ summary: 'Login with facebook' })
  async loginFacebook(
    @Body() loginFacebookDto: LoginFacebookDto,
  ): Promise<ResponseLogin> {
    return this.authService.loginFacebook(loginFacebookDto);
  }

  @Post('client/google/login')
  @ApiOperation({ summary: 'Login with google' })
  async logInGoogle(
    @Body() loginInstagramDto: LoginGoogleDto,
  ): Promise<ResponseLogin> {
    return this.authService.logInGoogle(loginInstagramDto);
  }
}
