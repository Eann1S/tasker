import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../libs/shared/src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserDto } from '../../../../libs/shared/src';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    try {
      return await this.prisma.user.create({ data });
    } catch (_) {
      const message = `User with email ${data.email} already exists.`;
      Logger.error(message);
      throw new ConflictException(message);
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (_) {
      const message = `User with id ${id} not found.`;
      Logger.error(message);
      throw new NotFoundException(message);
    }
  }

  async getProfileByUserId(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (_) {
      const message = `User with email ${email} not found.`;
      Logger.error(message);
      throw new NotFoundException(message);
    }
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (_) {
      const message = `User with id ${id} not found.`;
      Logger.error(message);
      throw new NotFoundException(message);
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (_) {
      const message = `User with id ${id} not found.`;
      Logger.error(message);
      throw new NotFoundException(message);
    }
  }
}
