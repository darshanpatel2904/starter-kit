import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3001);
  const appUrl = configService.get<string>('app.appUrl', 'http://localhost:3000');

  app.enableCors({
    origin: appUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
