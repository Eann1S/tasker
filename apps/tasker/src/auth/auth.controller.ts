import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RegisterDto, LoginDto, UserDto, JwtDto } from '@tasker/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: UserDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged in successfully', type: JwtDto })
  async login(@Body() loginDto: LoginDto): Promise<JwtDto> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out successfully' })
  async logout(@Request() req: { userId: string }) {
    return this.authService.logout(req.userId);
  }

  @Public()
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User refreshed tokens successfully',
    type: JwtDto,
  })
  async refreshTokens(@Body() body: { refreshToken: string }): Promise<JwtDto> {
    return this.authService.refreshTokens(body.refreshToken);
  }
}
