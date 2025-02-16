import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthMiddleware } from '../auth/ws.auth.middleware';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}

  @WebSocketServer()
  server: Server;

  async emitNotifications() {}

  afterInit(server: Server) {
    Logger.log('Init');
    server.use(WsAuthMiddleware(this.authService))
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.join(client.data.userId);
    Logger.log(
      `Websocket connected ${client.id}, userId: ${client.data.userId}`
    );
  }

  handleDisconnect(client: Socket) {
    Logger.log(`Websocket disconnected ${client.id}`);
  }
}
