import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schemas/session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name : 'Session' , schema: SessionSchema }])],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
