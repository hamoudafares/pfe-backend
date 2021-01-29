import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { PresentationSchema } from './schemas/presentation.schema';
import { TeachersModule } from '../teachers/teachers.module';
import { SessionModule } from '../session/session.module';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [MongooseModule.forFeature([{ name : 'Presentation' , schema: PresentationSchema }]) ,
    TeachersModule,
    SessionModule,
    StudentsModule
  ],
  controllers: [PresentationController],
  providers: [PresentationService]
})
export class PresentationModule {}
