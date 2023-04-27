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

  /* Accepts user data as input, checks if the login exists,
   if not, enters the user into the database */
  async registration(userDetails: CreateUser): Promise<boolean> {
    const user = new User();
    user.username = userDetails.username;
    user.password = await bcrypt.hash(userDetails.password, 10);
    if (await this.validateLogin(user.username)) {
      try {
        await user.save();
        return true;
      } catch (err) {
        console.log(err);
      }
    } else {
      return false;
    }
  }

  /* Checks if the user exists in the database and checks if his password is correct */
  async validateUser(userDetails: CreateUser): Promise<boolean> {
    try {
      const foundUser = await User.findOneBy({
        username: userDetails.username,
      });
      if (foundUser) {
        return !!(await bcrypt.compare(
          userDetails.password,
          foundUser.password,
        ));
      }
    } catch (err) {
      console.log(err);
    }
  }

  /* User login, if successful returns a token, if not, returns an error */
  async login(userDetails: CreateUser) {
    if (await this.validateUser(userDetails)) {
      try {
        return {
          access_token: await this.jwtService.signAsync({
            username: userDetails.username,
          }),
        };
      } catch (err) {
        console.log(err);
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  /* Checks if the username exists in the database */
  async validateLogin(userName: string): Promise<boolean> {
    try {
      return (await User.findBy({ username: userName })).length === 0;
    } catch (err) {
      console.log(err);
    }
  }

  /* Returns all registered users */
  async getAllUsers(): Promise<User[]> {
    //TODO remove or create guard on production
    try {
      return await User.find();
    } catch (err) {
      console.log(err);
    }
  }

  /* Adds airports to the database */
  async fillAirports(): Promise<void> {
    //TODO remove or create guard on production
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
  }

  /* Generates fake flights */
  async generateFlying(number: number): Promise<Flying[]> {
    //TODO remove or create guard on production
    for (let i = 0; i < number; i++) {
      const flying = new Flying();
      const date = new Date(
        Date.now() +
          Math.random() * (1000 * 60 * 60 * 24 * 30 - 1000 * 60 * 60 * 24 + 1) +
          1000 * 60 * 60 * 24,
      );
      try {
        const from = await Airports.findOneBy({
          id: Math.floor(Math.random() * 7201),
        });
        const to = await Airports.findOneBy({
          id: Math.floor(Math.random() * (await Airports.count())),
        });
        flying.destinationFrom = from.ICAO;
        flying.destinationTo = to.ICAO;
      } catch (err) {
        console.log(err);
      }
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
    try {
      return await Flying.find();
    } catch (err) {
      console.log(err);
    }
  }
}
