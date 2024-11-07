import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService, UserDto } from '@tasker/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.prisma.user.create({ data });
      Logger.debug(`user created with id: ${user.id}`);
      return user;
    } catch (error) {
      Logger.error(error);
      throw new ConflictException(`User with email ${data.email} already exists.`);
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string) {
    try {
      Logger.debug(`Getting user with id: ${id}`);
      return await this.prisma.user.findUniqueOrThrow({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async getProfileByUserId(id: string): Promise<UserDto> {
    Logger.debug(`Getting user profile for user id: ${id}`);
    const user = await this.getUserById(id);
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    try {
      Logger.debug(`Getting user with email: ${email}`);
      return await this.prisma.user.findUniqueOrThrow({ where: { email } });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with email ${email} not found.`);
    }
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    try {
      Logger.debug(`Updating user with id: ${id}`);
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async deleteUser(id: string) {
    try {
      Logger.debug(`Deleting user with id: ${id}`);
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }
}
