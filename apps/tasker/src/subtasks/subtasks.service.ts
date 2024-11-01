import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateSubtaskDto,
  PrismaService,
  UpdateSubtaskDto,
} from '@tasker/shared';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async createSubtask(taskId: string, subtask: CreateSubtaskDto) {
    try {
      Logger.debug(`Creating subtask for task with id: ${taskId}`);
      return await this.prisma.subtask.create({
        data: {
          ...subtask,
          task: {
            connect: {
              id: taskId,
            },
          }
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create subtask');
    }
  }
  async getSubtasksForTask(taskId: string) {
    try {
      Logger.debug(`Getting subtasks for task with id: ${taskId}`);
      return await this.prisma.subtask.findMany({
        where: {
          taskId,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${taskId} not found`);
    }
  }
  async updateSubtask(id: string, subtask: UpdateSubtaskDto) {
    try {
      Logger.debug(`Updating subtask with id: ${id}`);
      return await this.prisma.subtask.update({
        where: {
          id,
        },
        data: subtask,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`subtask with id ${id} not found`);
    }
  }
  async deleteSubtask(id: string) {
    try {
      Logger.debug(`Deleting subtask with id: ${id}`);
      await this.prisma.subtask.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException(`subtask with id ${id} not found`);
    }
  }
}
