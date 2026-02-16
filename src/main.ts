import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: string = new ConfigService().get<string>('PORT') ?? '3000';
  await app.listen(port);
}
bootstrap();
