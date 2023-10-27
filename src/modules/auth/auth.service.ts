import {
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import * as config from 'config';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import {
  JWT_CONSTANTS,
  CLIENT_AUTH_CACHE_PREFIX,
} from 'src/modules/auth/auth.constants';
import { httpErrors } from 'src/shares/exceptions';
import { LoginGoogleDto } from './dto/login-google.dto';
import { ClientService } from '../client/client.service';
import { Client } from '../client/schemas/client.schema';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { UserGoogleInfoDto } from './dto/user-google-info.dto';
import { UserFacebookInfoDto } from './dto/user-facebook-info.dto';
import { ResponseLogin } from 'src/modules/auth/dto/response-login.dto';
import { PayloadRefreshTokenDto } from './dto/payload-refresh-token.dto';
import { ResponseRefreshTokenDto } from './dto/response-refresh-token.dto';
import { PayloadAccessTokenDto } from 'src/shares/dtos/payload-access-token.dto';

const baseGoogleUrl = config.get<string>('google.base_api');
const baseFacebookUrl = config.get<string>('facebook.graph_api');

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private httpService: HttpService,
    private clientService: ClientService,
  ) {}

  async ClientGetAccessToken(
    payload: PayloadRefreshTokenDto,
  ): Promise<ResponseRefreshTokenDto> {
    const { userId, refreshToken } = payload;
    const [client, oldRefreshToken] = await Promise.all([
      this.clientService.findById(userId.toString()),
      this.cacheManager.get<string>(`${CLIENT_AUTH_CACHE_PREFIX}${userId}`),
    ]);
    if (!client) throw new ForbiddenException();
    if (!oldRefreshToken)
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
    if (refreshToken === oldRefreshToken) {
      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.generateClientAccessToken(client['_id']),
        this.generateClientRefreshToken(client['_id']),
      ]);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        iat: Date.now(),
        exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
      };
    } else
      throw new HttpException(
        httpErrors.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
  }

  async generateClientAccessToken(client: Client): Promise<string> {
    return this.jwtService.signAsync(
      {
        userId: client['_id'],
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.clientAccessTokenSecret,
        expiresIn: JWT_CONSTANTS.clientAccessTokenExpiry,
      },
    );
  }

  async generateClientRefreshToken(user: Client): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        userId: user['_id'],
        date: Date.now(),
      },
      {
        secret: JWT_CONSTANTS.clientRefreshTokenSecret,
        expiresIn: JWT_CONSTANTS.clientRefreshTokenExpiry,
      },
    );
    await this.cacheManager.set(
      `${CLIENT_AUTH_CACHE_PREFIX}${user['_id']}`,
      refreshToken,
      JWT_CONSTANTS.clientRefreshTokenExpiry,
    );
    return refreshToken;
  }

  async decodeAccessToken(
    accessToken: string,
  ): Promise<PayloadAccessTokenDto | any> {
    return this.jwtService.decode(accessToken);
  }

  async loginFacebook(
    loginFacebookDto: LoginFacebookDto,
  ): Promise<ResponseLogin> {
    const { accessToken } = loginFacebookDto;
    const url = `${baseFacebookUrl}me?fields=id,first_name,last_name,picture&access_token=${accessToken}`;
    const userData: UserFacebookInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response.data || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (!userData) {
      throw new BadRequestException(
        httpErrors.FACEBOOK_TOKEN_INVALID_OR_EXPIRES,
      );
    }
    const client = await this.clientService.findOrCreateFacebookUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateClientAccessToken(client['_id']),
      this.generateClientRefreshToken(client['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
    };
  }

  async logInGoogle(loginGoogleDto: LoginGoogleDto): Promise<any> {
    const { accessToken } = loginGoogleDto;
    const url = `${baseGoogleUrl}userinfo?access_token=${accessToken}`;
    const userData: UserGoogleInfoDto = await lastValueFrom(
      this.httpService
        .get(url)
        .pipe(
          map((response) => {
            return response || null;
          }),
        )
        .pipe(
          catchError((error) => {
            throw new BadRequestException(error.message);
          }),
        ),
    );
    if (!userData) {
      throw new BadRequestException(httpErrors.GOOGLE_TOKEN_INVALID_OR_EXPIRES);
    }
    const client = await this.clientService.findOrCreateGoogleUser(userData);
    const [accessToken_, refreshToken] = await Promise.all([
      this.generateClientAccessToken(client['_id']),
      this.generateClientRefreshToken(client['_id']),
    ]);
    return {
      accessToken: accessToken_,
      refreshToken,
      iat: Date.now(),
      exp: Date.now() + JWT_CONSTANTS.clientAccessTokenExpiry,
    };
  }
}
