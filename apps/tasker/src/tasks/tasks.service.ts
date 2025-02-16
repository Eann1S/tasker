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
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  private include = {
    creator: true,
    subtasks: true,
    labels: true,
    assignee: true,
  };

  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    try {
      Logger.debug(`Creating task`);
      const {
        title,
        status,
        priority,
        dueDate,
        description,
        assigneeId,
        teamId,
      } = dto;

      let task = await this.prisma.task.create({
        data: {
          title,
          status,
          priority,
          dueDate,
          description,
          creator: { connect: { id: userId } },
        },
        include: this.include,
      });

      if (assigneeId) {
        task = await this.prisma.task.update({
          where: { id: task.id },
          data: { assignee: { connect: { id: assigneeId } } },
          include: this.include,
        });
      }
      if (teamId) {
        task = await this.prisma.task.update({
          where: { id: task.id },
          data: { team: { connect: { id: teamId } } },
          include: { ...this.include, team: true },
        });
      }

      Logger.debug(`Task created with id: ${task.id}`);
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async assignTask(taskId: string, assigneeId: string) {
    try {
      Logger.debug(
        `Assigning task with id: ${taskId} to user with id: ${assigneeId}`
      );

      const task = await this.prisma.task.update({
        where: { id: taskId },
        data: { assignee: { connect: { id: assigneeId } } },
        include: this.include,
      });

      Logger.debug(
        `Task with id: ${taskId} assigned to user with id: ${assigneeId}`
      );
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Failed to assign task ${taskId} to user ${assigneeId}`
      );
    }
  }

  async removeTaskFromAssignee(taskId: string, assigneeId: string) {
    try {
      Logger.debug(
        `Removing task with id: ${taskId} from user with id: ${assigneeId}`
      );

      await this.prisma.task.update({
        where: { id: taskId },
        data: { assignee: { disconnect: { id: assigneeId } } },
      });

      Logger.debug(
        `Task with id: ${taskId} removed from user with id: ${assigneeId}`
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Failed to assign task ${taskId} to user ${assigneeId}`
      );
    }
  }

  async getTasksForAssignee(assigneeId: string, teamId?: string) {
    Logger.debug(`Finding all tasks for user with id: ${assigneeId}`);

    const tasks = await this.prisma.task.findMany({
      where: { assigneeId, teamId },
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
      throw new InternalServerErrorException(
        `Failed to assign labels to task ${id}`
      );
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
      throw new InternalServerErrorException(
        `Failed to remove labels from task ${id}`
      );
    }
  }
}
