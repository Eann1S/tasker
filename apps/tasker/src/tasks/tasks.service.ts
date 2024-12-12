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
import { mapTaskToDto } from './tasks.mappings';

@Injectable()
export class TasksService {
  private include = {
    creator: true,
    subtasks: true,
    labels: true,
  };

  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, data: CreateTaskDto) {
    try {
      Logger.debug(`Creating task`);

      const task = await this.prisma.task.create({
        data: { ...data, creator: { connect: { id: userId } } },
        include: this.include,
      });

      Logger.debug(`Task created with id: ${task.id}`);
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTasksForUser(creatorId: string) {
    Logger.debug(`Finding all tasks for user with id: ${creatorId}`);

    const tasks = await this.prisma.task.findMany({
      where: { creatorId },
      include: this.include,
    });
    return tasks.map(mapTaskToDto);
  }

  async getTasksForTeam(teamId: string) {
    Logger.debug(`Finding all tasks for team with id: ${teamId}`);

    const tasks = await this.prisma.task.findMany({
      where: { teamId },
      include: this.include,
    });
    return tasks.map(mapTaskToDto);
  }

  async getTask(id: string) {
    try {
      Logger.debug(`Finding task with id: ${id}`);

      const task = await this.prisma.task.findUniqueOrThrow({
        where: { id },
        include: this.include,
      });
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async updateTask(id: string, data: UpdateTaskDto) {
    try {
      Logger.debug(`Updating task with id: ${id}`);

      const task = await this.prisma.task.update({
        where: { id },
        data,
        include: this.include,
      });

      Logger.debug(`Task with id: ${id} updated`);
      return mapTaskToDto(task);
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
      
      Logger.debug(`Task with id: ${id} deleted`);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }

  async createLabelsForTask(taskId: string, labels: CreateLabelDto[]) {
    try {
      Logger.debug(`Creating labels for task ${taskId}`);

      const task = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          labels: {
            create: labels.map((label) => ({ ...label })),
          },
        },
        include: this.include,
      });

      Logger.debug(`Labels created for task ${taskId}`);
      return mapTaskToDto(task);
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

      const task = await this.prisma.task.update({
        where: { id },
        data: {
          labels: {
            connect: labelIds.map((id) => ({ id })),
          },
        },
        include: this.include,
      });

      Logger.debug(`Labels assigned to task with id: ${id}`);
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Failed to assign labels to task ${id}`);
    }
  }

  async removeLabelsFromTask(id: string, labelIds: string[]) {
    try {
      Logger.debug(`Removing labels from task with id: ${id}`);

      const task = await this.prisma.task.update({
        where: { id },
        data: {
          labels: {
            disconnect: labelIds.map((id) => ({ id })),
          },
        },
        include: this.include,
      });

      Logger.debug(`Labels removed from task with id: ${id}`);
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Failed to remove labels from task ${id}`);
    }
  }
}
