import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentSchema } from "./schemas/student.schema";
import {DeletedStudentsService} from "./deleted-students.service";

@Module({
  imports: [MongooseModule.forFeature([
      {name: 'Student', schema: StudentSchema},
      {name: 'StudentsDeleted', schema: StudentSchema}
      ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, DeletedStudentsService]
})
export class StudentsModule {}
