import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

export const WsUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): any | null => {
    const client = ctx.switchToWs().getClient<Socket>();
    const token = client.handshake.auth.token;
    const { id, role }: any = jwt.verify(token, process.env.JWT_SECRET);

    return { id, role };
  },
);
