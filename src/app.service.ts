import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entitys/user.entity';
import { CreateUser } from './app.controller';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}

  async registration(userDetails: CreateUser): Promise<boolean> {
    const user = new User();
    user.username = userDetails.username;
    user.password = await bcrypt.hash(userDetails.password, 10);
    if (await this.validateLogin(user.username)) {
      await user.save();
      return true;
    } else {
      return false;
    }
  }

  async validateUser(userDetails: CreateUser) {
    const foundUser = await User.findOneBy({ username: userDetails.username });
    if (foundUser) {
      return !!(await bcrypt.compare(userDetails.password, foundUser.password));
    }
  }

  async login(userDetails: CreateUser) {
    if (await this.validateUser(userDetails)) {
      return {
        access_token: await this.jwtService.signAsync({
          username: userDetails.username,
        }),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async validateLogin(userName: string): Promise<boolean> {
    return (await User.findBy({ username: userName })).length === 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await User.find();
  }
}
