import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  JwtDto,
  LoginDto,
  RegisterDto,
  UserDto,
} from '../../../../libs/shared/src';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly saltOrRounds = 10;
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

    const token = await this.jwtService.signAsync({ sub: user.id });
    Logger.log(`Login successful for ${email}`);
    return { token };
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

  private async isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
