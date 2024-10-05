import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TASK_SERVICE } from '../../../libs/shared/src/constants/microservices.tokens';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../../../libs/shared/src';

@Controller()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(@Inject(TASK_SERVICE) private taskService: ClientProxy) {}

  @Post('task')
  async createTask(@Body() input: Prisma.TaskCreateInput) {
    return this.taskService.send({ cmd: 'create' }, input);
  }

  @Get('task/:id')
  async getTask(@Param('id') id: number) {
    return this.taskService.send({ cmd: 'find_by_id' }, +id);
  }

  @Get('tasks/:userId')
  async getTasksForUser(@Param('userId') userId: number) {
    return this.taskService.send({ cmd: 'find_tasks_for_user' }, +userId);
  }

  @Put('task/:id')
  async updateTask(
    @Param('id') id: number,
    @Body() input: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.send({ cmd: 'update' }, { id, input });
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: number) {
    return this.taskService.send({ cmd: 'delete' }, +id);
  }
}
