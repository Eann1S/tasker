import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  generateUser,
  LoginDto,
  RedisService,
  RegisterDto,
} from '@tasker/shared';
import * as _ from 'lodash';
import { Prisma } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Mocked, TestBed } from '@suites/unit';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Mocked<UsersService>;
  let jwtService: Mocked<JwtService>;
  let redis: Mocked<RedisService>;
  let user: Prisma.UserGetPayload<Prisma.UserDefaultArgs>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;
    usersService = unitRef.get(UsersService);
    jwtService = unitRef.get(JwtService);
    redis = unitRef.get(RedisService);
  });

  beforeEach(async () => {
    user = generateUser();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    let registerDto: RegisterDto;

    beforeEach(async () => {
      registerDto = {
        email: user.email,
        username: user.username,
        password: user.password,
      };
    });

    it('should register', async () => {
      usersService.createUser.mockResolvedValue(user);

      const actual = await service.register(registerDto);

      const expected = _.omit(user, 'password');
      expect(actual).toStrictEqual(expected);
      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          username: registerDto.username,
          password: expect.any(String),
        })
      );
    });

    it('should not register when user with that email already exists', async () => {
      const message = 'User already exists';
      usersService.createUser.mockRejectedValue(new Error(message));

      expect(service.register(registerDto)).rejects.toThrow(new Error(message));
    });
  });

  describe('login', () => {
    let loginDto: LoginDto;

    beforeEach(async () => {
      loginDto = {
        email: user.email,
        password: user.password,
      };
      user['password'] = await argon2.hash(user.password);
    });

    it('should login', async () => {
      usersService.getUserByEmail.mockResolvedValue(user);
      jwtService.signAsync.mockResolvedValue('token');

      const actual = await service.login(loginDto);

      expect(actual).toMatchObject({ accessToken: 'token' });
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(redis.set).toHaveBeenCalledWith(
        user.id.toString(),
        'token',
        expect.any(Number)
      );
    });

    it('should not login if password is invalid', async () => {
      loginDto.password = 'invalid_password';
      usersService.getUserByEmail.mockResolvedValue(user);

      expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
    });
  });

  describe('logout', () => {
    it('should logout', async () => {
      redis.del.mockResolvedValue(1);

      await service.logout(user.id.toString());

      expect(redis.del).toHaveBeenCalledWith(user.id.toString());
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id.toString() });
      jwtService.signAsync.mockResolvedValue('token');
      redis.exists.mockResolvedValue(true);

      const actual = await service.refreshTokens('refresh_token');

      expect(actual).toMatchObject({ accessToken: 'token', refreshToken: 'token' });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('refresh_token');
      expect(redis.exists).toHaveBeenCalledWith(user.id.toString());
    });

    it('should not refresh token when it is missing', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id.toString() });
      redis.exists.mockResolvedValue(false);

      expect(service.refreshTokens()).rejects.toThrow(
        new UnauthorizedException('Refresh token is missing')
      );
    });

    it('should not refresh token when it does not exist', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id.toString() });
      redis.exists.mockResolvedValue(false);

      expect(service.refreshTokens('invalid')).rejects.toThrow(
        new UnauthorizedException('Refresh token does not exist')
      );
    });
  });

  describe('validateToken', () => {
    it('should return payload when token is valid', async () => {
      jwtService.verifyAsync.mockResolvedValue({ sub: user.id.toString() });

      const actual = await service.validateToken('token');

      expect(actual).toMatchObject({ sub: user.id.toString() });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('token');
    });

    it('should throw error when token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Token is invalid'));

      expect(service.validateToken('token')).rejects.toThrow(
        new Error('Token is invalid')
      );
    });
  });
});
