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

    delete user.password;
    Logger.log(`Registration successful for ${email}`);
    return user;
  }

  async login(loginDto: LoginDto, res): Promise<JwtDto> {
    const { email, password } = loginDto;
    Logger.log(`Login attempt for ${email}`);

    const user = await this.userService.getUserByEmail(email);
    const passwordValid = await this.isPasswordValid(password, user.password);
    if (!passwordValid) {
      Logger.error(`Invalid credentials for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateAndStoreAccessToken(res, user.id);
    await this.generateAndStoreRefreshToken(res, user.id);

    Logger.log(`Login successful for ${email}`);
    return { accessToken };
  }

  async logout(userId: string, res): Promise<void> {
    await this.deleteToken(userId);
    await this.removeTokenFromCookie(res, 'accessToken');
    await this.removeTokenFromCookie(res, 'refreshToken');
    Logger.log(`Logout successful for id: ${userId}`);
  }

  async refreshTokens(req, res): Promise<JwtDto> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    
    const payload = await this.validateToken(refreshToken);
    const tokenExists = await this.doesTokenExist(payload.sub);
    if (!tokenExists) {
      throw new UnauthorizedException('Refresh token does not exist in cache');
    }

    const accessToken = await this.generateAndStoreAccessToken(res, payload.sub);
    await this.generateAndStoreRefreshToken(res, payload.sub);

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

  private async generateAndStoreAccessToken(res, sub: string) {
    const accessToken = await this.generateAccessToken(sub);
    await this.storeTokenAsCookie(res, 'accessToken', accessToken);
    return accessToken;
  }

  private generateAccessToken(sub: string) {
    return this.jwtService.signAsync(
      { sub },
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  }

  private async generateAndStoreRefreshToken(res, sub: string) {
    const refreshToken = await this.generateRefreshToken(sub);
    await this.storeTokenAsCookie(res, 'refreshToken', refreshToken);
    await this.storeToken(sub, refreshToken, this.ttlRefreshToken);
  }

  private generateRefreshToken(sub: string) {
    return this.jwtService.signAsync(
      { sub },
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );
  }

  private async storeTokenAsCookie(response, cookieName: string, token: string) {
    response.cookie(cookieName, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });
  }

  private async removeTokenFromCookie(response, cookieName: string) {
    response.clearCookie(cookieName, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
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
