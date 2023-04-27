import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entitys/user.entity';
import { CreateUser } from './app.controller';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Flying } from './entitys/flying.entity';
import { air, TypeOfFlight } from './constants';
import { Airports } from './entitys/airports.entity';

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

  /* adds airports to the database */
  async fillAirports() {
    for (const port of Object.keys(air)) {
      try {
        const airport = new Airports();
        airport.city = air[port].city;
        airport.country = air[port].country;
        airport.ICAO = air[port].icao;
        airport.name = air[port].name;
        airport.state = air[port].state;
        await airport.save();
      } catch (err) {
        console.log(err);
      }
    }
    console.log('done');
  }

  async generateFlying(number: number): Promise<Flying[]> {
    for (let i = 0; i < number; i++) {
      const flying = new Flying();
      const from = await Airports.findOneBy({
        id: Math.floor(Math.random() * 7201),
      });
      const to = await Airports.findOneBy({
        id: Math.floor(Math.random() * (await Airports.count())),
      });
      flying.destinationFrom = from.ICAO;
      flying.destinationTo = to.ICAO;
      const date = new Date(
        Date.now() +
          Math.random() * (1000 * 60 * 60 * 24 * 30 - 1000 * 60 * 60 * 24 + 1) +
          1000 * 60 * 60 * 24,
      );
      flying.departureDate = date;
      if (Math.random() > 0.5) {
        flying.costUSD = Math.random() * (3000 - 200 + 1) + 200;
        flying.type = TypeOfFlight.roundTrip;
        const dateReturn = new Date(date);
        flying.returnDate = new Date(
          dateReturn.setDate(
            dateReturn.getDate() + Math.floor(Math.random() * 15 + 1),
          ),
        );
      } else {
        flying.costUSD = Math.floor(Math.random() * (1500 - 5 + 1) + 5);
        flying.type = TypeOfFlight.oneWay;
        flying.returnDate = flying.departureDate;
      }
      try {
        await flying.save();
      } catch (err) {
        console.log(err);
      }
    }
    return await Flying.find();
  }
}
