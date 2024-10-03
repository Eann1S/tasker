import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({ data });
  }

  async findTaskById(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async findTasksForUser(userId: number) {
    return this.prisma.task.findMany({ where: { assignedToId: userId } });
  }

  async updateTask(id: number, data: Prisma.TaskUpdateInput) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
