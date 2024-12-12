import { Subtask, TaskStatus } from '@prisma/client';
import { SubtasksService } from './subtasks.service';
import { Mocked, TestBed } from '@suites/unit';
import { CreateSubtaskDto, PrismaService, UpdateSubtaskDto } from '@tasker/shared';
import { faker } from '@faker-js/faker/.';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('SubtasksService', () => {
  let service: SubtasksService;
  let prisma: Mocked<PrismaService>;
  let subtask: Subtask;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(SubtasksService).compile();

    service = unit;
    prisma = unitRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    subtask = {
      id: faker.string.uuid(),
      taskId: faker.string.uuid(),
      title: faker.string.sample(),
      status: faker.helpers.enumValue(TaskStatus),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
  });

  describe('create subtask', () => {
    it('should create a subtask', async () => {
      const createSubtaskDto: CreateSubtaskDto = {
        title: subtask.title,
        status: subtask.status,
      };
      prisma.subtask.create.mockResolvedValue(subtask);

      const actual = await service.createSubtask(
        subtask.taskId,
        createSubtaskDto
      );

      expect(actual).toEqual(subtask);
      expect(prisma.subtask.create).toHaveBeenCalledWith({
        data: {
          ...createSubtaskDto,
          task: {
            connect: {
              id: subtask.taskId,
            },
          },
        },
      });
    });

    it('should not create a subtask', async () => {
      const createSubtaskDto: CreateSubtaskDto = {
        title: subtask.title,
        status: subtask.status,
      };
      prisma.subtask.create.mockRejectedValue(new Error());

      expect(
        service.createSubtask(subtask.taskId, createSubtaskDto)
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create subtask')
      );
    });
  });

  describe('get subtasks', () => {
    it('should return subtasks for task', async () => {
      prisma.subtask.findMany.mockResolvedValue([subtask]);

      const actual = await service.getSubtasksForTask(subtask.taskId);

      expect(actual).toEqual([subtask]);
      expect(prisma.subtask.findMany).toHaveBeenCalledWith({
        where: {
          taskId: subtask.taskId,
        },
      });
    });

    it('should not return subtasks when task not found', async () => {
      prisma.subtask.findMany.mockRejectedValue(new Error());

      expect(service.getSubtasksForTask(subtask.taskId)).rejects.toThrow(
        new NotFoundException(`task with id ${subtask.taskId} not found`)
      );
    });
  });

  describe('update subtask', () => {
    it('should update a subtask', async () => {
      const updateSubtaskDto: UpdateSubtaskDto = {
        title: subtask.title,
        status: subtask.status,
      };
      prisma.subtask.update.mockResolvedValue(subtask);

      const actual = await service.updateSubtask(
        subtask.id,
        updateSubtaskDto
      );

      expect(actual).toEqual(subtask);
      expect(prisma.subtask.update).toHaveBeenCalledWith({
        where: {
          id: subtask.id,
        },
        data: updateSubtaskDto,
      });
    });

    it('should not update subtask if it does not exist', async () => {
      const updateSubtaskDto: UpdateSubtaskDto = {
        title: subtask.title,
        status: subtask.status,
      };
      prisma.subtask.update.mockRejectedValue(new Error());

      expect(
        service.updateSubtask(subtask.id, updateSubtaskDto)
      ).rejects.toThrow(
        new NotFoundException(`subtask with id ${subtask.id} not found`)
      );
    });
  });

  describe('delete subtask', () => {
    it('should delete subtask', async () => {
      prisma.subtask.delete.mockResolvedValue(subtask);

      await service.deleteSubtask(subtask.id);

      expect(prisma.subtask.delete).toHaveBeenCalledWith({
        where: {
          id: subtask.id,
        },
      });
    });

    it('should not delete subtask when subtask does not exist', async () => {
      prisma.subtask.delete.mockRejectedValue(new Error());

      expect(service.deleteSubtask(subtask.id)).rejects.toThrow(
        new NotFoundException(`subtask with id ${subtask.id} not found`)
      );
    });
  });
});
