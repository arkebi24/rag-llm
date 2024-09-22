import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplicationOptions } from '@nestjs/common';

async function bootstrap() {
  const options: NestApplicationOptions = {
    logger: ['error', 'warn', 'debug'],
    cors: true,
  };
  const app = await NestFactory.create(AppModule, options);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
