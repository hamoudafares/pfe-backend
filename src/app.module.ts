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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://nour:nour@cluster0.0ogrz.mongodb.net/pfe_manager?retryWrites=true&w=majority',{ dbName: 'test', useNewUrlParser: true }),
    MulterModule.register({ dest: './uploads', }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_ID, // generated ethereal user
            pass: process.env.EMAIL_PASS // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false
          },
        },
        defaults: {
          from:'uni.insat@outlook.com',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    UsersModule,
    StudentsModule,
    TeachersModule,
    MailModule
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
