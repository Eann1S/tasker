import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '../../../libs/shared/src/constants/microservices.tokens';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export class UserServiceAdapter {
  constructor(@Inject(USER_SERVICE) private userService: ClientProxy) {}

  async createUser(data: any) {
    return firstValueFrom(this.userService.send({ cmd: 'create' }, data));
  }

  async findUserByEmail(email: string) {
    return firstValueFrom(
      this.userService.send({ cmd: 'find_by_email' }, email),
    );
  }
}
