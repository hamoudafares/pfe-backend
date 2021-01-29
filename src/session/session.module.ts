import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schemas/session.schema';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name : 'Session' , schema: SessionSchema }]) , TeachersModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports : [SessionService]
})
export class SessionModule {}
