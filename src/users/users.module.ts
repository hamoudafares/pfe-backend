import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./schemas/user.schema";
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { passportJwtStrategy } from './auth-strategy/passport-jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../authorization/guards/roles.guard';

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
