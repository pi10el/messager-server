import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
  namespace: '/chat',
})
export class MessagerGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('MessagerGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { username: string; room: string; text: string },
  ) {
    this.wss.to(data.room).emit('msgToClient', data);
  }

  @SubscribeMessage('subscribeRoom')
  handleSubscribeGroup(client: Socket, room: string) {
    client.join(room);
  }

  @SubscribeMessage('unsubscribeRoom')
  handleUnsubscribeGroup(client: Socket, room: string) {
    client.leave(room);
  }
}
