import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateLabelDto,
  CreateTaskDto,
  PrismaService,
  UpdateTaskDto,
} from '@tasker/shared';

@Injectable()
export class TasksService {
  private include = {
    creator: {
      select: {
        id: true,
        email: true,
        username: true,
      },
    },
    subtasks: true,
    labels: true,
  };

  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, data: CreateTaskDto) {
    try {
      Logger.debug(`Creating task`);
      return await this.prisma.task.create({
        data: { ...data, creator: { connect: { id: userId } } },
        include: this.include,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTasksForUser(creatorId: string) {
    Logger.debug(`Finding all tasks for user with id: ${creatorId}`);
    return this.prisma.task.findMany({
      where: { creatorId },
      include: this.include,
    });
  }

  async getTask(id: string) {
    try {
      Logger.debug(`Finding task with id: ${id}`);
      return await this.prisma.task.findUnique({
        where: { id },
        include: this.include,
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
        include: this.include,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async deleteTask(id: string) {
    try {
      Logger.debug(`Deleting task with id: ${id}`);
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async createLabelsForTask(taskId: string, labels: CreateLabelDto[]) {
    try {
      Logger.debug(`Creating labels for task ${taskId}`);
      return await this.prisma.task.update({
        where: { id: taskId },
        data: {
          labels: {
            create: labels.map((label) => ({ ...label })),
          },
        },
        include: this.include,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Failed to create labels for task ${taskId}`
      );
    }
  }

  async assignLabelsToTask(id: string, labelIds: string[]) {
    try {
      Logger.debug(`Assigning labels to task with id: ${id}`);
      return await this.prisma.task.update({
        where: { id },
        data: {
          labels: {
            connect: labelIds.map((id) => ({ id })),
          },
        },
        include: this.include,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Failed to assign labels to task ${id}`);
    }
  }

  async removeLabelsFromTask(id: string, labelIds: string[]) {
    try {
      Logger.debug(`Removing labels from task with id: ${id}`);
      return await this.prisma.task.update({
        where: { id },
        data: {
          labels: {
            disconnect: labelIds.map((id) => ({ id })),
          },
        },
        include: this.include,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Failed to remove labels from task ${id}`);
    }
  }
}
