import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskModule,
    {
      options: {
        host: process.env.TASK_SERVICE_HOST,
        port: +process.env.TASK_SERVICE_PORT,
      },
    },
  );
  await app.listen();
  const logger = new Logger();
  logger.log('task-service is listening');
}
bootstrap();
