import { Controller } from '@nestjs/common';
import { AuthService } from './auth-service.service';
import { RegisterDto } from '../../../libs/shared/src/dtos/RegisterDto';
import { LoginDto } from '../../../libs/shared/src/dtos/LoginDto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessagePattern({ cmd: 'register' })
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
