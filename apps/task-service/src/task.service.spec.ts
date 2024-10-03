import { PrismaService } from '../../../libs/shared/prisma/prisma.service';
import { Prisma, Task, User } from '@prisma/client';
import {
  createTestTask,
  createTestUser,
} from '../../../libs/shared/src/test_utils/test_utils';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('User Service', () => {
  let taskService: TaskService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    taskService = module.get(TaskService);
    prisma = module.get(PrismaService);
  });

  describe('create task', () => {
    it('should create task', async () => {
      const task: Task = createTestTask();
      const data: Prisma.TaskCreateInput = { ...task };
      prisma.task.create.mockResolvedValue(task);

      const res = await taskService.createTask(data);

      return expect(res).toEqual(task);
    });
  });

  describe('find task', () => {
    it('should return task by id', async () => {
      const task: Task = createTestTask();
      prisma.task.findUnique.mockResolvedValue(task);

      const res = await taskService.findTaskById(task.id);

      return expect(res).toEqual(task);
    });

    it('should return null when task was not found', async () => {
      const task: Task = createTestTask();
      prisma.task.findUnique.mockResolvedValue(null);

      const res = await taskService.findTaskById(task.id);

      return expect(res).toBeNull();
    });

    it('should return tasks for user', async () => {
      const user: User = createTestUser();
      const tasks: Task[] = [createTestTask(user.id), createTestTask(user.id)];
      prisma.task.findMany.mockResolvedValue(tasks);

      const res = await taskService.findTasksForUser(user.id);

      return expect(res).toEqual(tasks);
    });

    it('should return empty list when there are no tasks', async () => {
      const user: User = createTestUser();
      prisma.task.findMany.mockResolvedValue([]);

      const res = await taskService.findTasksForUser(user.id);

      return expect(res).toEqual([]);
    });
  });

  describe('update task', () => {
    it('should update task', async () => {
      const user: User = createTestUser();
      const task: Task = createTestTask(user.id);
      const data: Prisma.TaskUpdateInput = { ...task };
      prisma.task.update.mockResolvedValue(task);

      const res = await taskService.updateTask(user.id, data);

      return expect(res).toEqual(task);
    });
  });

  describe('delete task', () => {
    it('should delete task', async () => {
      const task: Task = createTestTask();
      prisma.task.delete.mockResolvedValue(task);

      const res = await taskService.deleteTask(task.id);

      return expect(res).toEqual(task);
    });
  });
});
