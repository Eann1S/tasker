import { UsersService } from './users.service';
import { createUser, PrismaService } from '@tasker/shared';
import { TestBed, Mocked } from '@suites/unit';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as _ from 'lodash';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: Mocked<PrismaService>;
  let user: User;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersService).compile();

    service = unit;
    prisma = unitRef.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    user = createUser();
  });

  describe('Create user', () => {
    let createUserData: Prisma.UserCreateInput;

    beforeEach(async () => {
      createUserData = _.omit(user, ['id', 'createdAt', 'updatedAt']);
    });

    it('should create user', async () => {
      prisma.user.create.mockResolvedValue(user);

      const actual = await service.createUser(createUserData);

      expect(actual).toEqual(user);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserData });
    });

    it('should not create user when one with email already exists', async () => {
      prisma.user.create.mockRejectedValue(new Error('User already exists'));

      expect(service.createUser(createUserData)).rejects.toThrow(
        new ConflictException(
          `User with email ${createUserData.email} already exists.`
        )
      );
    });
  });

  describe('Get users', () => {
    it('should return users', async () => {
      const users = [createUser(), createUser(), createUser()];
      prisma.user.findMany.mockResolvedValue(users);

      const actual = await service.getAllUsers();

      expect(actual).toEqual(users);
    });

    it('should return user by id', async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const actual = await service.getUserById(user.id);

      expect(actual).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
    });

    it('should not return user when it was not found', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('User not found'));

      expect(service.getUserById(user.id)).rejects.toThrow(
        new NotFoundException(`User with id ${user.id} not found.`)
      );
    });

    it('should return user profile', async () => {
      prisma.user.findUnique.mockResolvedValue(user);

      const actual = await service.getProfileByUserId(user.id);

      const expected = _.omit(user, ['password']);
      expect(actual).toEqual(expected);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: user.id },
      });
    });
  });

  describe('Update user', () => {
    let updateUserData: Prisma.UserUpdateInput;

    beforeEach(async () => {
      updateUserData = _.omit(user, ['id', 'createdAt', 'updatedAt']);
    });

    it('should update user', async () => {
      prisma.user.update.mockResolvedValue(user);

      const actual = await service.updateUser(user.id, updateUserData);

      expect(actual).toEqual(user);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: updateUserData,
      });
    });

    it('should not update user when it was not found', async () => {
      prisma.user.update.mockRejectedValue(new Error('User not found'));

      expect(service.updateUser(user.id, updateUserData)).rejects.toThrow(
        new NotFoundException(`User with id ${user.id} not found.`)
      );
    });
  });

  describe('Delete user', () => {
    it('should delete user', async () => {
      prisma.user.delete.mockResolvedValue(user);

      const actual = await service.deleteUser(user.id);

      expect(actual).toEqual(user);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: user.id },
      });
    });

    it('should not delete user when it was not found', async () => {
      prisma.user.delete.mockRejectedValue(new Error('User not found'));

      expect(service.deleteUser(user.id)).rejects.toThrow(
        new NotFoundException(`User with id ${user.id} not found.`)
      );
    });
  });
});
