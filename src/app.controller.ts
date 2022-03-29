import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_CONST } from './constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hey')
  getHello(): string {
    console.log('process.env.POSTGRES_HOST', APP_CONST.SUPER_ADMIN_ROLE);
    return this.appService.getHello();
  }
}
