import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UserModule } from 'src/domains/user/user.module';

@Module({
  providers: [TasksService],
  imports: [UserModule],
})
export class TasksModule {}
