import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { RegisterDto, LoginDto, UserDto, JwtDto } from '@tasker/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<JwtDto> {
    return this.authService.login(loginDto, res);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User logged out successfully' })
  async logout(
    @Req() req: { userId: string },
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req.userId, res);
  }

  @Public()
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User refreshed tokens successfully',
    type: JwtDto,
  })
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<JwtDto> {
    return this.authService.refreshTokens(req, res);
  }
}
