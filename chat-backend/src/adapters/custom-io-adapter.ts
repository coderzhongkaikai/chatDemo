import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { config } from '../config';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    options = {
      ...options,
      cors: {
        origin: /.*/,
        credentials: true,
      },
    };
    return super.createIOServer(config.websocketPort, options);
  }
}