import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/domains/user/user.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly userService: UserService) {}

  @Cron('@daily')
  handleCron() {
    this.userService.deleteTestProfiles();
    this.logger.debug('Временные аккаунты удалены');
  }
}
