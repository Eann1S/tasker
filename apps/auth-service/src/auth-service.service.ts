import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../../libs/shared/src/dtos/RegisterDto';
import { UserDto } from '../../../libs/shared/src/dtos/UserDto';
import { JwtDto } from '../../../libs/shared/src/dtos/JwtDto';
import { LoginDto } from '../../../libs/shared/src/dtos/LoginDto';
import { UserServiceAdapter } from './user-service.adapter';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserServiceAdapter,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<JwtDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserDto> {
    await this.checkThatUserDoesNotExist(registerDto.email);
    const hashedPassword = await this.hashPassword(registerDto.password);
    return this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserDto> {
    const user = await this.getUserByEmailOrThrowException(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Your password is not valid');
    }
    const { password: _, ...result } = user;
    return result;
  }

  private async checkThatUserDoesNotExist(email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException(`user with ${email} already exist`);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async getUserByEmailOrThrowException(email: string): Promise<User> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        `user with email: ${email} doesn't exist`,
      );
    }
    return user;
  }
}
