import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { PrismaModule, SharedModule } from '@tasker/shared';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [PrismaModule, SharedModule, TasksModule],
  providers: [TeamsService],
  controllers: [TeamsController]
})
export class TeamsModule {}
