import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaModule } from '../../../libs/shared/prisma/prisma.module';
import { SharedModule } from '../../../libs/shared/src';

@Module({
  imports: [PrismaModule, SharedModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
