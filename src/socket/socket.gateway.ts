import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserRole } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/domains/user/user.service';
import * as jwt from 'jsonwebtoken';
import { WsUser } from 'src/common/decorators/ws-user.decorator';

interface WsUser {
  id: number;
  role: UserRole;
}

@WebSocketGateway({
  cors: { origin: 'http://localhost:5173' },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('MessagerGateway');

  afterInit() {
    this.logger.log('Initialized!');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const { id }: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userService.findById(id);
      if (!user) client.disconnect();
    } catch (err) {
      client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const { id }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await this.userService.findById(id);

    this.userService.update(user.id, { onlineAt: new Date(Date.now()) });
  }

  @SubscribeMessage('profile')
  async profile(@WsUser() user: WsUser) {
    return this.userService.profile(user.id);
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
