import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST,
        port: +process.env.AUTH_SERVICE_PORT,
      },
    },
  );
  await app.listen();
  const logger = new Logger();
  logger.log('auth-service is listening');
}
bootstrap();
