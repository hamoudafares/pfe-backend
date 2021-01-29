import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { PresentationModule } from './presentation/presentation.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://nour:nour@cluster0.0ogrz.mongodb.net/pfe_manager?retryWrites=true&w=majority',{ dbName: 'test', useNewUrlParser: true , useCreateIndex : true }), UsersModule, PresentationModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
