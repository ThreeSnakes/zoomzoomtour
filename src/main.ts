import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('zoomzoomtour API')
    .setDescription('zoomzoomtour API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(PORT);
}
bootstrap();
