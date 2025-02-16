import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  LoginDto,
  JwtDto,
  JwtPayload,
  RegisterDto,
  UserDto,
  RedisService,
} from '@tasker/shared';
import { mapUserToDto } from '../users/users.mappings';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  private readonly ttlRefreshToken = (+process.env.JWT_REFRESH_EXPIRATION) * 1000;
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

    Logger.log(`Registration successful for ${email}`);
    return mapUserToDto(user);
  }

  async login(loginDto: LoginDto, res: Response): Promise<JwtDto> {
    const { email, password } = loginDto;
    Logger.log(`Login attempt for ${email}`);

    const user = await this.userService.getUserByEmail(email);
    const passwordValid = await this.isPasswordValid(password, user.password);
    if (!passwordValid) {
      Logger.error(`Invalid credentials for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      sub: user.id.toString(),
    });
    this.setTokenToCookie(res, refreshToken);

    Logger.log(`Login successful for ${email}`);
    return { accessToken };
  }

  async logout(userId: string, res: Response): Promise<void> {
    await this.deleteToken(userId);
    res.clearCookie('refresh_token');
    Logger.log(`Logout successful for id: ${userId}`);
  }

  async refreshTokens(req: Request, res: Response): Promise<JwtDto> {
    console.log(req.cookies);
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const payload = await this.validateToken(refreshToken);
    const tokenExists = await this.doesTokenExist(payload.sub);
    if (!tokenExists) {
      throw new UnauthorizedException('Refresh token does not exist');
    }

    const { accessToken, refreshToken: newRefresh } = await this.generateTokens(
      payload
    );
    this.setTokenToCookie(res, newRefresh);

    Logger.log(`Refresh tokens successful for id: ${payload.sub}`);
    return { accessToken };
  }

  async validateToken(token: string): Promise<JwtPayload | never> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      Logger.error(error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  private setTokenToCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      maxAge: this.ttlRefreshToken,
      secure: false,
      sameSite: 'none',
    });
  }

  private async generateTokens(payload: Omit<JwtPayload, 'exp' | 'iat'>) {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private async generateAccessToken(payload: Omit<JwtPayload, 'exp' | 'iat'>) {
    return this.jwtService.signAsync(
      { sub: payload.sub },
      { expiresIn: +process.env.JWT_EXPIRATION }
    );
  }

  private async generateRefreshToken(payload: Omit<JwtPayload, 'exp' | 'iat'>) {
    const refreshToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      { expiresIn: +process.env.JWT_REFRESH_EXPIRATION }
    );
    await this.storeToken(payload.sub, refreshToken, this.ttlRefreshToken);
    return refreshToken;
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
