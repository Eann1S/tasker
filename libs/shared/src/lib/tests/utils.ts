import { Label, Task, TaskPriority, TaskStatus, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function generateUser(overwrites: Partial<User> = {}): User {
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

export function generateTask(overwrites: Partial<Task> = {}): Task {
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
  };
}

export function generateLabel(overwrites: Partial<Label> = {}): Label {
  const { id = faker.string.uuid(), name = faker.string.sample() } = overwrites;
  return {
    id,
    name,
  };
}
