import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  JwtDto,
  JwtPayload,
  LoginDto,
  RegisterDto,
  UserDto,
} from '../../../../libs/shared/src';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly saltOrRounds = process.env.SALT_OR_ROUNDS;
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<JwtDto> {
    const { email, password } = loginDto;
    Logger.log(`Login attempt for ${email}`);

    const user = await this.userService.getUserByEmail(email);
    if (!(await this.isPasswordValid(password, user.password))) {
      Logger.error(`Invalid credentials for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    Logger.log(`Login successful for ${email}`);
    return { access_token, refresh_token };
  }

  async refreshToken(payload: JwtPayload, refresh_token: string): Promise<JwtDto> {
    const access_token = await this.generateAccessToken({
      sub: payload.sub,
      email: payload.email,
    });
    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    const { email, username, password } = registerDto;
    Logger.log(`Registration attempt for ${email}`);

    const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
    const user = await this.userService.createUser({
      email,
      username,
      password: hashedPassword,
    });

    const { password: _, ...result } = user;
    Logger.log(`Registration successful for ${email}`);
    return result;
  }

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
