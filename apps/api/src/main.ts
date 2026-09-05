import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3001);
  const appUrl = configService.get<string>(
    'app.appUrl',
    'http://localhost:3000',
  );

  app.enableCors({
    origin: appUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Starter Kit API')
    .setDescription(
      'RESTful API services for file storage, user management, and authentication.',
    )
    .setVersion('1.0')
    .addCookieAuth('better-auth.session_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'better-auth.session_token',
      description: 'Session cookie managed by Better Auth',
    })
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Bearer token authorization header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
}
bootstrap();
