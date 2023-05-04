import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Flying } from './entitys/flying.entity';
import { User } from './entitys/user.entity';
import { Airports } from './entitys/airports.entity';

export class CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  phone?: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.html')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getDocumentation() {}

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return await this.appService.getAllUsers();
  }

  @Post('validate')
  async postValidate(@Body() email: { email: string }) {
    return (await this.appService.validateLogin(email.email))
      ? { status: true, message: `email: «${email.email}» is available` }
      : { status: false, message: `email: «${email.email}» already exist` };
  }

  @Post('registration')
  async postUser(@Body() user: CreateUser) {
    return (await this.appService.registration(user))
      ? {
          status: true,
          message: `successfully registered new user «${user.firstName} ${user.lastName}»`,
        }
      : { status: false, message: `registration failed` };
  }

  @Post('login')
  async postLogin(@Body() user: CreateUser) {
    return await this.appService.login(user);
  }

  @Get('air')
  async getAir(): Promise<void> {
    await this.appService.fillAirports();
  }

  @Get('airports')
  async getAirports(
    @Query()
    query: {
      title: string;
      number: number;
      skip: number;
    },
  ): Promise<Airports[]> {
    return await this.appService.getAirports(
      query.title,
      query.number,
      query.skip,
    );
  }

  @Get('flying')
  async getFlying(
    @Query()
    query: {
      number: number;
      skip: number;
      startDate: Date;
      endDate: Date;
      oneWay: string;
    },
  ) {
    return await this.appService.getFlight(
      +query.number || 0,
      +query.skip || 0,
      query.startDate,
      query.endDate,
      query.oneWay,
    );
  }

  @Get('gen-fly/:num')
  async generateFlying(@Param('num') num: number): Promise<Flying[]> {
    return await this.appService.generateFlying(num);
  }
}
