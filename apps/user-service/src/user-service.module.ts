import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { SharedModule } from '../../../libs/shared/src';
import { UserController } from './user-service.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        './apps/user-service/.env.local',
        './apps/user-service/.env',
      ],
      expandVariables: true,
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
