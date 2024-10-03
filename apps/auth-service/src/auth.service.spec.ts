import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserServiceAdapter } from '../../../libs/shared/src/adapters/user-service.adapter';
import { JwtService } from '@nestjs/jwt';
import { createTestUser } from '../../../libs/shared/src/test_utils/test_utils';
import { AuthDto, JwtDto } from '../../../libs/shared/src';
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import mock, { MockProxy } from 'jest-mock-extended/lib/Mock';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('Auth Service', () => {
  let authService: AuthService;
  let userService: MockProxy<UserServiceAdapter>;
  let jwtService: MockProxy<JwtService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserServiceAdapter, JwtService],
    })
      .overrideProvider(UserServiceAdapter)
      .useValue(mock<UserServiceAdapter>())
      .overrideProvider(JwtService)
      .useValue(mock<JwtService>())
      .compile();

    authService = app.get(AuthService);
    userService = app.get(UserServiceAdapter);
    jwtService = app.get(JwtService);
  });

  describe('login', () => {
    it('should login', async () => {
      const user: User = createTestUser();
      const authDto: AuthDto = { ...user };
      const token = faker.string.uuid();
      jwtService.sign.mockReturnValue(token);
      userService.findUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

      const res: JwtDto = await authService.login(authDto);

      return expect(res).toHaveProperty('access_token', token);
    });

    it('should not login when password is invalid', async () => {
      const user: User = createTestUser();
      const authDto: AuthDto = { ...user };
      userService.findUserByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      return expect(authService.login(authDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should not login when user was not found', async () => {
      const user: User = createTestUser();
      const authDto: AuthDto = { ...user };
      userService.findUserByEmail.mockResolvedValue(null);

      return expect(authService.login(authDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register', async () => {
      const user: User = createTestUser();
      const authDto: AuthDto = { ...user };
      userService.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue(user.password);
      userService.createUser.mockResolvedValue(user);

      const res = await authService.register(authDto);

      return expect(res).toEqual(user);
    });

    it('should not register when user already exists', async () => {
      const user: User = createTestUser();
      const authDto: AuthDto = { ...user };
      userService.findUserByEmail.mockResolvedValue(user);

      return expect(authService.register(authDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
