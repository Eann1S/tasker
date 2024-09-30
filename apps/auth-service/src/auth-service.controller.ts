import { Controller } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { AuthDto } from '../../../libs/shared/src/dtos/AuthDto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @MessagePattern({ cmd: 'register' })
  async register(authDto: AuthDto) {
    return this.authService.register(authDto);
  }
}
