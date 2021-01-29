import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentSchema } from "./schemas/student.schema";
import {DeletedStudentsService} from "./deleted-students.service";
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { TeachersModule } from '../teachers/teachers.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MongooseModule.forFeature([
      {name: 'Student', schema: StudentSchema},
      {name: 'StudentsDeleted', schema: StudentSchema}
      ]),
    UsersModule,
    TeachersModule
  ],
  controllers: [StudentsController],
  providers: [StudentsService, DeletedStudentsService]
})
export class StudentsModule {}
