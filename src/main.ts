import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionInterceptor } from './interceptors/prima-exception.interceptor';
import { LoggingService } from './logging/logging.service';
import { CustomExceptionFilter } from './exceptionFilter/exceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const loggingService = app.get(LoggingService);

  app.useLogger(loggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const yamlDoc = YAML.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, yamlDoc);
  app.useGlobalInterceptors(new PrismaExceptionInterceptor());

  app.useGlobalFilters(new CustomExceptionFilter(loggingService));
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port);

  process.on('uncaughtException', (error) => {
    loggingService.error(`Uncaught Exception: ${error.message}`, error.stack);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggingService.error(
      `Unhandled Rejection at: ${promise} reason: ${reason}`,
    );
  });
}

bootstrap();
