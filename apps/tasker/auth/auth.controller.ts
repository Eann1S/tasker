import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../../../libs/shared/src/constants/microservices.tokens';
import { AuthDto } from '../../../libs/shared/src/dtos/AuthDto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private authService: ClientProxy) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.send({ cmd: 'login' }, authDto);
  }

  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.send({ cmd: 'register' }, authDto);
  }
}
