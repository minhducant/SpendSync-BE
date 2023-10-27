import * as dotenv from 'dotenv';
import * as config from 'config';
import * as Sentry from '@sentry/node';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModules } from './app.module';
import { BodyValidationPipe } from 'src/shares/pipes/body.validation.pipe';
import { SentryInterceptor } from 'src/shares/interceptors/sentry.interceptor';
import { HttpExceptionFilter } from 'src/shares/filters/http-exception.filter';
import { ResponseTransformInterceptor } from 'src/shares/interceptors/response.interceptor';

dotenv.config();
const appPort = 3343;
// const appPort = config.get<number>('app.port');
const prefix = config.get<string>('app.prefix');
const appEnv = config.get<string>('app.node_env');
const dnsSentry = config.get<string>('sentry_dns');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModules, {
    cors: true,
  });
  Sentry.init({
    dsn: dnsSentry,
    environment: appEnv,
  });
  app.setGlobalPrefix(prefix);
  app.enableCors();
  app.useGlobalPipes(new BodyValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SentryInterceptor());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const appName = config.get<string>('app.name');
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(appName)
    .setDescription(appName)
    .setVersion(prefix)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${prefix}/docs`, app, document, {
    customSiteTitle: appName,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
    },
  });
  await app.listen(appPort);
}
bootstrap();
