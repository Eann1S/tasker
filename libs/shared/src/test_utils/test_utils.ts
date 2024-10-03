import { Role, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const createTestUser = (): User => {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement([Role.ADMIN, Role.USER]),
    createdAt: faker.date.anytime(),
  };
};
