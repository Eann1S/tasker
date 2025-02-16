import { createRandomUser } from './utils/auth.utils.e2e';
import { io, Socket } from 'socket.io-client';

describe('Events e2e tests', () => {
  describe('Websocket', () => {
    let socket: Socket;

    afterEach(() => {
      socket.close();
    });

    it('should connect', async () => {
      const { accessToken } = await createRandomUser();
      socket = createSocket(accessToken);

      await new Promise<void>((resolve) => {
        socket.on('connect', () => {
          console.log('connected');
          resolve();
        });
      });
    });

    function createSocket(accessToken: string) {
      return io(`http://localhost:${process.env.PORT}`, {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        autoConnect: true,
      });
    }
  });
});
