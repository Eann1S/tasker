import { Controller, Get, Request } from '@nestjs/common';
import { JwtPayload } from '../../../../libs/shared/src';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: { payload: JwtPayload }) {
    return this.usersService.getProfileByUserId(req.payload.sub);
  }
}
