import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class VerifyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (user.status === 'pending')
      throw new UnauthorizedException('Ваш email не подтвержден');

    if (user.status === 'blocked')
      throw new UnauthorizedException('Ваш ваш аккаунт заблокирован');

    return true;
  }
}
