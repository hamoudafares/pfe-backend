import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { PresentationModule } from './presentation/presentation.module';
import { SessionModule } from './session/session.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './authorization/guards/roles.guard';
import { passportJwtStrategy } from './users/auth-strategy/passport-jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './authorization/guards/jwt.auth.guard';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nour:nour@cluster0.0ogrz.mongodb.net/pfe_manager?retryWrites=true&w=majority',{ dbName: 'test', useNewUrlParser: true }),
    MulterModule.register({ dest: './uploads', }),
    UsersModule,
    StudentsModule,
    TeachersModule
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {}
