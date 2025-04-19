import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '@global/filters/http-exception.filter';
import { validationExceptionFactory } from '@global/filters/validation.exception';

// import { validationExceptionFactory } from '@global/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // برای تبدیل به نوع صحیح (مثل Date, int و...)
      whitelist: true, // برای فیلتر کردن پروپرتی‌های اضافی
      forbidNonWhitelisted: true, // برای جلوگیری از ارسال داده‌های غیرمجاز
      skipMissingProperties: false,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.use(cookieParser());

  await app.listen(port);
}

bootstrap();
