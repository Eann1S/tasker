import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { SharedModule } from '../../../libs/shared/src';
import { UserController } from './user-service.controller';
import { PrismaModule } from '../../../libs/shared/prisma/prisma.module';

@Module({
  imports: [SharedModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
