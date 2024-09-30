import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../../../libs/shared/src/dtos/UserDto';
import { JwtDto } from '../../../libs/shared/src/dtos/JwtDto';
import { AuthDto } from '../../../libs/shared/src/dtos/AuthDto';
import { UserServiceAdapter } from '../../../libs/shared/src/adapters/user-service.adapter';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserServiceAdapter,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<JwtDto> {
    const user = await this.validateUser(authDto.email, authDto.password);
    this.logger.log(`user with email ${user.email} is authorized`);
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async register(authDto: AuthDto): Promise<UserDto> {
    await this.checkThatUserDoesNotExist(authDto.email);
    const hashedPassword = await this.hashPassword(authDto.password);
    this.logger.log(`registering user with email ${authDto.email}`);
    return this.userService.createUser({
      ...authDto,
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
