import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { TeacherSchema } from './schema/teacher.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'Teacher', schema: TeacherSchema},
    {name: 'TeachersDeleted', schema: TeacherSchema}
  ]),
    UsersModule
  ],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule {}
