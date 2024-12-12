import { TasksService } from './tasks.service';
import { Task, } from '@prisma/client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Mocked } from '@suites/doubles.jest';
import { TestBed } from '@suites/unit';
import {
  PrismaService,
  CreateTaskDto,
  UpdateTaskDto,
  generateLabelData,
  generateTaskData,
} from '@tasker/shared';
import { mapTaskToDto } from './tasks.mappings';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: Mocked<PrismaService>;
  let task: Task;
  const include = {
    creator: true,
    subtasks: true,
    labels: true,
  };

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(TasksService).compile();

    service = unit;
    prisma = unitRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    task = generateTaskData();
  });

  describe('create task', () => {
    let createTaskDto: CreateTaskDto;

    beforeEach(async () => {
      createTaskDto = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        status: task.status,
      };
    });

    it('should create a task', async () => {
      prisma.task.create.mockResolvedValue(task);

      const actual = await service.createTask(task.creatorId, createTaskDto);

      expect(actual).toEqual(mapTaskToDto(task));
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          ...createTaskDto,
          creator: { connect: { id: task.creatorId } },
        },
        include,
      });
    });

    it('should not create a task', async () => {
      prisma.task.create.mockRejectedValue(new Error());

      expect(service.createTask(task.creatorId, createTaskDto)).rejects.toThrow(
        new InternalServerErrorException('Failed to create task')
      );
    });
  });

  describe('get tasks', () => {
    it('should return task', async () => {
      prisma.task.findUniqueOrThrow.mockResolvedValue(task);

      const actual = await service.getTask(task.id);

      expect(actual).toEqual(mapTaskToDto(task));
      expect(prisma.task.findUniqueOrThrow).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        include,
      });
    });

    it('should not return task when it does not exist', async () => {
      prisma.task.findUniqueOrThrow.mockRejectedValue(new Error());

      expect(service.getTask(task.id)).rejects.toThrow(
        new NotFoundException(`task with id ${task.id} not found`)
      );
    });

    it('should return tasks for user', async () => {
      prisma.task.findMany.mockResolvedValue([task]);

      const actual = await service.getTasksForUser(task.creatorId);

      expect(actual).toEqual([expect.objectContaining(mapTaskToDto(task))]);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          creatorId: task.creatorId,
        },
        include,
      });
    });

    it('should return tasks for team', async () => {
      prisma.task.findMany.mockResolvedValue([task]);

      const actual = await service.getTasksForTeam(task.teamId);

      expect(actual).toEqual([expect.objectContaining(mapTaskToDto(task))]);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          teamId: task.teamId,
        },
        include,
      });
    });
  });

  describe('update task', () => {
    let updateTaskDto: UpdateTaskDto;

    beforeEach(async () => {
      updateTaskDto = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        status: task.status,
      };
    });

    it('should update task', async () => {
      prisma.task.update.mockResolvedValue(task);

      const actual = await service.updateTask(task.id, updateTaskDto);

      expect(actual).toEqual(mapTaskToDto(task));
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: updateTaskDto,
        include,
      });
    });

    it('should not update task if it does not exist', async () => {
      prisma.task.update.mockRejectedValue(new Error());

      expect(service.updateTask(task.id, updateTaskDto)).rejects.toThrow(
        new NotFoundException(`task with id ${task.id} not found`)
      );
    });
  });

  describe('delete task', () => {
    it('should delete task', async () => {
      prisma.task.delete.mockResolvedValue(task);

      await service.deleteTask(task.id);

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
      });
    });

    it('should not delete task when task does not exist', async () => {
      prisma.task.delete.mockRejectedValue(new Error());

      expect(service.deleteTask(task.id)).rejects.toThrow(
        new NotFoundException(`task with id ${task.id} not found`)
      );
    });
  });

  describe('labels', () => {
    let labels = [];
    let labelIds = [];

    beforeEach(() => {
      labels = [generateLabelData(), generateLabelData()];
      labelIds = labels.map((label) => label.id);
    });

    it('should create labels for task', async () => {
      prisma.task.update.mockResolvedValue(task);

      await service.createLabelsForTask(task.id, labels);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: {
          labels: {
            create: labels.map((label) => ({ ...label })),
          },
        },
        include,
      });
    });

    it('should assign labels to task', async () => {
      prisma.task.update.mockResolvedValue(task);

      await service.assignLabelsToTask(task.id, labelIds);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: {
          labels: {
            connect: labelIds.map((id) => ({ id })),
          },
        },
        include,
      });
    });

    it('should remove labels from task', async () => {
      prisma.task.update.mockResolvedValue(task);

      await service.removeLabelsFromTask(task.id, labelIds);

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
        data: {
          labels: {
            disconnect: labelIds.map((id) => ({ id })),
          },
        },
        include,
      });
    });
  });
});
