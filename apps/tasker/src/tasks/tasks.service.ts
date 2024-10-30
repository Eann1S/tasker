import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@tasker/shared';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskUncheckedCreateInput) {
    const task = await this.prisma.task.create({ data });
    Logger.debug(`Created task with id: ${task.id}`);
    return task;
  }

  async findAllForUser(creatorId: string) {
    Logger.debug(`Finding all tasks for user with id: ${creatorId}`);
    return this.prisma.task.findMany({
      where: { creatorId },
    });
  }

  async getTask(id: string) {
    try {
      Logger.debug(`Finding task with id: ${id}`);
      return await this.prisma.task.findUnique({
        where: { id },
      });
    } catch(error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`)
    }
  }

  async updateTask(id: string, data: Prisma.TaskUpdateInput) {
    try {
      Logger.debug(`Updating task with id: ${id}`);
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch(error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`)
    }
  }

  async deleteTask(id: string) {
    try {
      Logger.debug(`Deleting task with id: ${id}`);
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch(error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`)
    }
  }
}
