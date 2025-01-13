import { Label, Subtask, Task, TaskPriority, TaskStatus, Team, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function generateUserData(overwrites: Partial<User> = {}): User {
  const {
    id = faker.string.uuid(),
    email = faker.internet.email(),
    username = faker.person.fullName(),
    password = faker.internet.password(),
    createdAt = faker.date.anytime(),
    updatedAt = faker.date.anytime(),
  } = overwrites;
  return {
    id,
    email,
    username,
    password,
    createdAt,
    updatedAt,
  };
}

export function generateTaskData(overwrites: Partial<Task> = {}): Task {
  const {
    id = faker.string.uuid(),
    title = faker.string.sample(),
    description = faker.string.sample(),
    status = faker.helpers.enumValue(TaskStatus),
    priority = faker.helpers.enumValue(TaskPriority),
    creatorId = faker.string.uuid(),
    dueDate = faker.date.future(),
    createdAt = faker.date.anytime(),
    updatedAt = faker.date.anytime(),
    teamId = faker.string.uuid(),
  } = overwrites;
  return {
    id,
    title,
    description,
    status,
    priority,
    creatorId,
    dueDate,
    createdAt,
    updatedAt,
    teamId,
  };
}

export function generateSubtaskData(overwrites: Partial<Subtask> = {}): Subtask {
  const {
    id = faker.string.uuid(),
    taskId = faker.string.uuid(),
    title = faker.string.sample(),
    status = faker.helpers.enumValue(TaskStatus),
    createdAt = faker.date.anytime(),
    updatedAt = faker.date.anytime(),
  } = overwrites;
  return {
    id,
    taskId,
    title,
    status,
    createdAt,
    updatedAt,
  };
}

export function generateLabelData(overwrites: Partial<Label> = {}): Label {
  const { id = faker.string.uuid(), name = faker.string.sample() } = overwrites;
  return {
    id,
    name,
  };
}

export function generateTeamData(overwrites: Partial<Team> = {}): Team {
  const {
    id = faker.string.uuid(),
    name = faker.string.sample(),
    createdAt = faker.date.anytime(),
    updatedAt = faker.date.anytime(),
  } = overwrites;
  return {
    id,
    name,
    createdAt,
    updatedAt,
  };
}
