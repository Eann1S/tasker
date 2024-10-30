import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: { userId: string }) {
    return this.usersService.getProfileByUserId(req.userId);
  }
}
