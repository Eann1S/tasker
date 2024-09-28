import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create' })
  async createUser(data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'find_by_email' })
  async findUserByEmail(email: string) {
    return this.userService.findUserByEmail(email);
  }
}
