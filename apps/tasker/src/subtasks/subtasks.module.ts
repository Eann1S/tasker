import { Module } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { PrismaModule, SharedModule } from '@tasker/shared';

@Module({
  imports: [SharedModule, PrismaModule],
  providers: [SubtasksService],
  controllers: [SubtasksController],
  exports: [SubtasksService]
})
export class SubtasksModule {}
