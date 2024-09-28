import { NestFactory } from '@nestjs/core';
import { UserModule } from './user-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    { transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
  );
  await app.listen();
  console.log('user service is listening');
}
bootstrap();
