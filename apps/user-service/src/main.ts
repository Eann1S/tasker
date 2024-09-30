import { NestFactory } from '@nestjs/core';
import { UserModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST,
        port: +process.env.USER_SERVICE_PORT,
      },
    },
  );
  await app.listen();
  const logger = new Logger();
  logger.log('user-service is listening');
}
bootstrap();
