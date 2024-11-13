import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const yamlDoc = YAML.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, yamlDoc);
  await app.listen(process.env.PORT);
}
bootstrap();
