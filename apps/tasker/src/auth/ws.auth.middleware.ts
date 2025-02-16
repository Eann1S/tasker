import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtPayload } from '@tasker/shared';
import { AuthService } from './auth.service';

type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WsAuthMiddleware = (authService: AuthService): SocketMiddleware => {
  return async (socket: Socket, next) => {
    const token = extractTokenFromHeader(socket);
    let payload: JwtPayload;
    try {
      payload = await authService.validateToken(token);
    } catch (e) {
      Logger.error(e);
      throw new WsException(e);
    }
    socket.data.userId = payload.sub;
    next()
  };
};

function extractTokenFromHeader(client: Socket): string | undefined {
  const [type, token] =
    client.handshake.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
