import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '../constants/microservices.tokens';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserServiceAdapter {
  constructor(@Inject(USER_SERVICE) private userService: ClientProxy) {}

  async createUser(data: Prisma.UserCreateInput) {
    return firstValueFrom(this.userService.send({ cmd: 'create' }, data));
  }

  async findUserByEmail(email: string) {
    return firstValueFrom(
      this.userService.send({ cmd: 'find_by_email' }, email),
    );
  }
}
