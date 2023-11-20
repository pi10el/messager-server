import { Module } from '@nestjs/common';
import { MessagerGateway } from './socket/messager.gateway';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './domains/user/user.module';
import { AuthModule } from './domains/auth/auth.module';
import { ImageModule } from './domains/image/image.module';

@Module({
  imports: [
    DatabaseModule,
    ImageModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [],
  providers: [MessagerGateway],
})
export class AppModule {}
