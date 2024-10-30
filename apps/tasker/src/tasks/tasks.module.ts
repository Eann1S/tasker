import { Module } from '@nestjs/common';
import { PrismaModule, SharedModule } from '@tasker/shared';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    imports: [PrismaModule, SharedModule],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
