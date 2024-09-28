import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../../../libs/shared/src/constants/microservices.tokens';
import { LoginDto } from '../../../libs/shared/src/dtos/LoginDto';
import { RegisterDto } from '../../../libs/shared/src/dtos/RegisterDto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private authService: ClientProxy) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.send({ cmd: 'login' }, loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.send({ cmd: 'register' }, registerDto);
  }
}
