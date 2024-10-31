import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '@tasker/shared';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
