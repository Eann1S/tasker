import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern({ cmd: 'create' })
  async createTask(input: Prisma.TaskCreateInput) {
    return this.taskService.createTask(input);
  }

  @MessagePattern({ cmd: 'find_by_id' })
  async getTaskById(id: number) {
    return this.taskService.findTaskById(id);
  }

  @MessagePattern({ cmd: 'find_tasks_for_user' })
  async getTasksForUser(userId: number) {
    return this.taskService.findTasksForUser(userId);
  }

  @MessagePattern({ cmd: 'update' })
  async updateTask(data: { id: number; input: Prisma.TaskUpdateInput }) {
    return this.taskService.updateTask(+data.id, data.input);
  }

  @MessagePattern({ cmd: 'delete' })
  async deleteTask(id: number) {
    return this.taskService.deleteTask(id);
  }
}
