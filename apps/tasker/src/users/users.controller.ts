import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from '@tasker/shared';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    description: 'Profile of authorized user',
    type: UserDto,
  })
  async getProfile(@Request() req: { userId: string }): Promise<UserDto> {
    return this.usersService.getProfileByUserId(req.userId);
  }
}
