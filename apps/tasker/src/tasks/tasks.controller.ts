import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Prisma } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() data: Prisma.TaskUncheckedCreateInput) {
    return this.tasksService.createTask(data);
  }

  @Get('/user/:userId')
  async findAllForUser(@Param('userId') userId: string) {
    return this.tasksService.findAllForUser(userId);
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ) {
    return this.tasksService.updateTask(id, data);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
