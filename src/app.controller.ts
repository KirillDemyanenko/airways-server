import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Flying } from './entitys/flying.entity';

export class CreateUser {
  username: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll(): any {
    return this.appService.getAllUsers();
  }

  @Post('validate')
  async postValidate(@Body() login: { login: string }) {
    return (await this.appService.validateLogin(login.login))
      ? { status: true, message: `login: «${login.login}» is available` }
      : { status: false, message: `login: «${login.login}» already exist` };
  }

  @Post('registration')
  async postUser(@Body() user: CreateUser) {
    return (await this.appService.registration(user))
      ? {
          status: true,
          message: `successfully registered new user «${user.username}»`,
        }
      : { status: false, message: `registration failed` };
  }

  @Post('login')
  async postLogin(@Body() user: CreateUser) {
    return await this.appService.login(user);
  }

  @Get('air')
  getAir(): void {
    this.appService.fillAirports();
  }

  @Get('flying')
  async getFlying(): Promise<Flying[]> {
    return await this.appService.generateFlying(500);
  }
}
