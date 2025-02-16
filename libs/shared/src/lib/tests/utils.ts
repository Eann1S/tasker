import {
  TaskPriority,
  TaskStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import {
  CreateLabelDto,
  CreateSubtaskDto,
  CreateTaskDto,
  CreateTeamDto,
  RegisterDto,
} from '../dtos';

export function generateRegisterDto(
  overwrites: Partial<RegisterDto> = {}
): RegisterDto {
  const data = {
    email: faker.internet.email(),
    username: faker.person.fullName(),
    password: faker.internet.password(),
  };
  return { ...data, ...overwrites };
}

export function generateCreateTaskDto(
  overwrites: Partial<CreateTaskDto> = {}
): CreateTaskDto {
  const data = {
    title: faker.string.sample(),
    description: faker.string.sample(),
    status: faker.helpers.enumValue(TaskStatus),
    priority: faker.helpers.enumValue(TaskPriority),
    dueDate: faker.date.future(),
  };
  return { ...data, ...overwrites };
}

export function generateCreateSubtaskDto(
  overwrites: Partial<CreateSubtaskDto> = {}
): CreateSubtaskDto {
  const data = {
    title: faker.string.sample(),
    status: faker.helpers.enumValue(TaskStatus),
  };
  return { ...data, ...overwrites };
}

export function generateCreateLabelDto(
  overwrites: Partial<CreateLabelDto> = {}
): CreateLabelDto {
  const data = { id: faker.string.uuid(), name: faker.string.sample() };
  return { ...data, ...overwrites };
}

export function generateCreateTeamDto(
  overwrites: Partial<CreateTeamDto> = {}
): CreateTeamDto {
  const data = {
    name: faker.string.sample(),
  };
  return { ...data, ...overwrites };
}
