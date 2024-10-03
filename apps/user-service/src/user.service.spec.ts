import { UserService } from './user.service';
import { PrismaService } from '../../../libs/shared/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { createTestUser } from '../../../libs/shared/src/test_utils/test_utils';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test } from '@nestjs/testing';

describe('User Service', () => {
  let userService: UserService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    userService = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  describe('create user', () => {
    it('should create user', async () => {
      const user: User = createTestUser();
      const data: Prisma.UserCreateInput = { ...user };
      prisma.user.create.mockResolvedValue(user);

      const res = await userService.createUser(data);

      return expect(res).toEqual(user);
    });
  });

  describe('find user', () => {
    it('should return user when it exists', async () => {
      const user = createTestUser();
      prisma.user.findUnique.mockResolvedValue(user);

      const res = await userService.findUserByEmail(user.email);

      return expect(res).toEqual(user);
    });

    it('should return null when it does not exist', async () => {
      const user = createTestUser();
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await userService.findUserByEmail(user.email);

      return expect(res).toBeNull();
    });
  });
});
