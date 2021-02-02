import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./schemas/user.schema";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { passportJwtStrategy } from './auth-strategy/passport-jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name : 'User' , schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 86400
      }
    }),
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  controllers: [UsersController],
  providers: [UsersService, passportJwtStrategy],
  exports: [UsersService]
})
export class UsersModule {}
