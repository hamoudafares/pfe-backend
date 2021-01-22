import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://nour:nour@cluster0.0ogrz.mongodb.net/pfe_manager?retryWrites=true&w=majority',{ dbName: 'test', useNewUrlParser: true }), UsersModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
