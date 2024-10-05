import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  TASK_SERVICE,
} from '../../../libs/shared/src/constants/microservices.tokens';
import { SharedModule } from '../../../libs/shared/src';
import { AuthController } from '../auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { TaskController } from '../task/task.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    SharedModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST,
          port: +process.env.AUTH_SERVICE_PORT,
        },
      },
      {
        name: TASK_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.TASK_SERVICE_HOST,
          port: +process.env.TASK_SERVICE_PORT,
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController, TaskController],
  providers: [AppService],
})
export class AppModule {}
