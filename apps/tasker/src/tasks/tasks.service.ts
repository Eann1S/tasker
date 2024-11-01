import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto, PrismaService, UpdateTaskDto } from '@tasker/shared';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto) {
    try {
      Logger.debug(`Creating task`);
      return await this.prisma.task.create({ data });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTasksForUser(creatorId: string) {
    Logger.debug(`Finding all tasks for user with id: ${creatorId}`);
    return this.prisma.task.findMany({
      where: { creatorId },
      include: {
        subtasks: true,
      },
    });
  }

  async getTask(id: string) {
    try {
      Logger.debug(`Finding task with id: ${id}`);
      return await this.prisma.task.findUnique({
        where: { id },
        include: {
          subtasks: true,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    try {
      Logger.debug(`Updating task with id: ${id}`);
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async deleteTask(id: string) {
    try {
      Logger.debug(`Deleting task with id: ${id}`);
      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }
}
