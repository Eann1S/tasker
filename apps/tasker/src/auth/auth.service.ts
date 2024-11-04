import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  JwtDto,
  JwtPayload,
  RegisterDto,
  UserDto,
  RedisService,
} from '@tasker/shared';

@Injectable()
export class AuthService {
  private readonly ttlRefreshToken = +process.env.JWT_REFRESH_EXPIRATION_MILLIS;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService
  ) {}

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const { email, username, password } = registerDto;
    Logger.log(`Registration attempt for ${email}`);

    const hashedPassword = await argon2.hash(password);
    const user = await this.userService.createUser({
      email,
      username,
      password: hashedPassword,
    });

    delete user['password'];
    Logger.log(`Registration successful for ${email}`);
    return user;
  }

  async login(loginDto: LoginDto): Promise<JwtDto> {
    const { email, password } = loginDto;
    Logger.log(`Login attempt for ${email}`);

    const user = await this.userService.getUserByEmail(email);
    if (!(await this.isPasswordValid(password, user.password))) {
      Logger.error(`Invalid credentials for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    await this.storeToken(user.id, tokens.refreshToken, this.ttlRefreshToken);
    Logger.log(`Login successful for ${email}`);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.deleteToken(userId);
    Logger.log(`Logout successful for id: ${userId}`);
  }

  async refreshToken(refresh_token: string): Promise<JwtDto> {
    try {
      const payload = await this.validateToken(refresh_token);
      if (!(await this.doesTokenExist(payload.sub))) {
        throw new UnauthorizedException('Refresh token does not exist');
      }
      Logger.log(`Refresh tokens successful for id: ${payload.sub}`);
      return this.generateTokens(payload.sub);
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string): Promise<JwtPayload | never> {
    return this.jwtService.verifyAsync(token);
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  private async generateTokens(userId: string): Promise<JwtDto> {
    const payload = { sub: userId };
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: Omit<JwtPayload, 'exp' | 'iat'>) {
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  private generateRefreshToken(payload: Omit<JwtPayload, 'exp' | 'iat'>) {
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  }

  private async storeToken(userId: string, token: string, ttl: number) {
    return this.redisService.set(userId.toString(), token, ttl);
  }

  private async doesTokenExist(userId: string): Promise<boolean> {
    return !!(await this.redisService.exists(userId.toString()));
  }

  private async deleteToken(userId: string): Promise<number> {
    return this.redisService.del(userId.toString());
  }
}
