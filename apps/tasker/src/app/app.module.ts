import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '@tasker/shared';
import { TasksModule } from '../tasks/tasks.module';
import { SubtasksModule } from '../subtasks/subtasks.module';

@Module({
  imports: [AuthModule, TasksModule, SubtasksModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
