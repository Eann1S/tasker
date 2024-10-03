import { Role, Task, User, Status, Priority } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const createTestUser = (): User => {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(Object.values(Role)),
    createdAt: faker.date.anytime(),
  };
};

export const createTestTask = (userId?: number): Task => {
  return {
    id: faker.number.int(),
    createdAt: faker.date.anytime(),
    title: faker.string.sample(),
    description: faker.string.sample(),
    status: faker.helpers.arrayElement(Object.values(Status)),
    priority: faker.helpers.arrayElement(Object.values(Priority)),
    dueDate: faker.date.anytime(),
    assignedToId: userId || faker.number.int(),
    updatedAt: faker.date.anytime(),
  };
};
