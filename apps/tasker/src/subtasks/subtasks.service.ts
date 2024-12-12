import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateSubtaskDto,
  PrismaService,
  UpdateSubtaskDto,
} from '@tasker/shared';
import { mapSubtaskToDto } from './subtasks.mappings';

@Injectable()
export class SubtasksService {
  constructor(private prisma: PrismaService) {}

  async createSubtask(taskId: string, dto: CreateSubtaskDto) {
    try {
      Logger.debug(`Creating subtask for task with id: ${taskId}`);

      const subtask = await this.prisma.subtask.create({
        data: {
          ...dto,
          task: {
            connect: {
              id: taskId,
            },
          }
        },
      });

      Logger.debug(`Subtask created with id: ${subtask.id}`);
      return mapSubtaskToDto(subtask);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Failed to create subtask');
    }
  }
  async getSubtasksForTask(taskId: string) {
    try {
      Logger.debug(`Getting subtasks for task with id: ${taskId}`);

      const subtasks = await this.prisma.subtask.findMany({
        where: {
          taskId,
        },
      });
      return subtasks.map(mapSubtaskToDto);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`task with id ${taskId} not found`);
    }
  }
  async updateSubtask(id: string, dto: UpdateSubtaskDto) {
    try {
      Logger.debug(`Updating subtask with id: ${id}`);

      const subtask = await this.prisma.subtask.update({
        where: {
          id,
        },
        data: dto,
      });

      Logger.debug(`Subtask updated with id: ${subtask.id}`);
      return mapSubtaskToDto(subtask);
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

      Logger.debug(`Subtask deleted with id: ${id}`);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`subtask with id ${id} not found`);
    }
  }
}
