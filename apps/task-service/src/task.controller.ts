import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'create' })
  async createTask(data: Prisma.TaskCreateInput) {
    return this.taskService.createTask(data);
  }

  @MessagePattern({ cmd: 'find_by_id' })
  async getTaskById(id: number) {
    return this.taskService.findTaskById(id);
  }

  @MessagePattern({ cmd: 'find_many_for_user' })
  async getTasksForUser(userId: number) {
    return this.taskService.findTasksForUser(userId);
  }

  @MessagePattern({ cmd: 'update' })
  async updateTask(id: number, data: Prisma.TaskCreateInput) {
    return this.taskService.updateTask(id, data);
  }

  @MessagePattern({ cmd: 'delete' })
  async deleteTask(id: number) {
    return this.taskService.deleteTask(id);
  }
}
