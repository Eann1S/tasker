import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';
import { MicroserviceOptions } from '@nestjs/microservices';

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
}
bootstrap();
