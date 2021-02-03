import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IUser } from '../interfaces/user.interface';

dotenv.config();

export class passportJwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel('User') private readonly userModel : Model<IUser>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET
    });
  }

  async validate(payload) {
    const user = await this.userModel.findOne({email: payload.email} , '-password -salt');
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
