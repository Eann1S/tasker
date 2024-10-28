import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../../../libs/shared/src';

@Injectable()
export class AuthRefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractRefreshTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      request['payload'] = payload;
      request['refresh_token'] = token;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      Logger.log(error);
      throw new UnauthorizedException('Refresh token is invalid');
    }
    return true;
  }

  private extractRefreshTokenFromHeader(request: Request): string | undefined {
    const token = request.headers['refresh-token'] as string ?? undefined;
    return token;
  }
}
