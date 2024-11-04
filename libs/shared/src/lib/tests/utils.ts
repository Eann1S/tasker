import { Label, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export function createUser(overwrites: Partial<User> = {}): User {
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

export function createLabel(overwrites: Partial<Label> = {}): Label {
  const { id = faker.string.uuid(), name = faker.string.sample() } = overwrites;
  return {
    id,
    name,
  };
}
